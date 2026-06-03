import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ServicoService } from '../../../service/servico.service';
import { AgendamentoService } from '../../../service/agendamento.service';
import { WebsocketService } from '../../../service/websocket.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MeusAgendamentos } from '../meus-agendamentos/meus-agendamentos';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, MeusAgendamentos],
  templateUrl: './agendamentos.html',
  styleUrl: './agendamentos.css',
})
export class Agendamentos implements OnInit, OnDestroy {
  role = '';
  agendamentos: any[] = [];
  servicos: any[] = [];
  horariosDisponiveis: any[] = [];
  horarioSelecionado: any = null;
  dataSelecionada = '';

  agendamento = {
    inicio: '',
    cliente: { id: 0 },
    empresa: { id: 0 },
    servico: { id: 0 },
  };

  private subs: Subscription[] = [];
  private inscrito = false;

  constructor(
    private agendamentoService: AgendamentoService,
    private servicoService: ServicoService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private wsService: WebsocketService,
  ) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.role = localStorage.getItem('role') || '';

    // Retorno do Mercado Pago
    this.subs.push(
      this.route.queryParams.subscribe((params) => {
        const pagamento = params['pagamento'];
        const agendamentoId = params['agendamentoId'];
        if (pagamento === 'sucesso') {
          Swal.fire({
            icon: 'success',
            title: 'Pagamento aprovado! ✅',
            text: `Agendamento #${agendamentoId} confirmado.`,
          });
          this.router.navigate(['/agendamentos'], { replaceUrl: true });
        } else if (pagamento === 'falha') {
          Swal.fire({ icon: 'error', title: 'Pagamento não aprovado', text: 'Tente novamente.' });
          this.router.navigate(['/agendamentos'], { replaceUrl: true });
        } else if (pagamento === 'pendente') {
          Swal.fire({
            icon: 'info',
            title: 'Pagamento pendente ⏳',
            text: 'Avisaremos quando for confirmado.',
          });
          this.router.navigate(['/agendamentos'], { replaceUrl: true });
        }
      }),
    );

    Promise.resolve().then(() => {
      this.listarAgendamentos();
      this.listarServicos();
      this.cd.detectChanges();

      if (!this.inscrito) {
        this.inscrito = true;
        const usuarioId = Number(localStorage.getItem('usuarioId'));
        this.wsService.conectar(usuarioId, this.role);

        this.subs.push(
          this.wsService.notificacaoAdmin$.subscribe((n) => {
            Swal.fire({
              icon: 'info',
              title: '📅 Novo Agendamento!',
              text: n.mensagem,
              timer: 8000,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              showCloseButton: true,
            });
            this.listarAgendamentos();
          }),
        );

        this.subs.push(
          this.wsService.notificacaoUsuario$.subscribe((n) => {
            Swal.fire({
              icon: n.tipo === 'CANCELAMENTO' ? 'warning' : 'success',
              title:
                n.tipo === 'CANCELAMENTO'
                  ? '❌ Agendamento Cancelado'
                  : '✏️ Agendamento Atualizado',
              text: n.mensagem,
              timer: 8000,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
            });
            this.listarAgendamentos();
          }),
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.wsService.desconectar();
    this.inscrito = false;
  }

  listarAgendamentos() {
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) return;
    this.agendamentoService.listar(usuarioId).subscribe((res: any) => {
      this.agendamentos = res;
      this.cd.detectChanges();
    });
  }

  listarServicos() {
    setTimeout(() => {
      this.servicoService.listarTodos().subscribe((res: any) => {
        this.servicos = res;
        this.cd.detectChanges();
      });
    });
  }

  buscarHorarios() {
    if (!this.dataSelecionada || this.agendamento.servico.id === 0) return;
    this.agendamentoService
      .listarHorarios(this.agendamento.servico.id, this.dataSelecionada)
      .subscribe({
        next: (res: any) => {
          this.horariosDisponiveis = res;
          this.cd.detectChanges();
        },
      });
  }

  selecionarServico(item: any) {
    this.agendamento.servico.id = item.id;
    this.agendamento.empresa.id = item.profissional.id;
    this.buscarHorarios();
  }

  selecionarHorario(horario: any) {
    if (!horario.disponivel) return;
    this.horarioSelecionado = horario;
    this.agendamento.inicio = `${this.dataSelecionada}T${horario.hora}:00`;
  }

  salvar() {
    const usuarioId = localStorage.getItem('usuarioId');
    this.agendamento.cliente.id = Number(usuarioId);
    if (!this.dataSelecionada) {
      Swal.fire({ icon: 'warning', title: 'Selecione uma data' });
      return;
    }
    if (this.agendamento.servico.id === 0) {
      Swal.fire({ icon: 'warning', title: 'Selecione um serviço' });
      return;
    }
    if (!this.agendamento.inicio) {
      Swal.fire({ icon: 'warning', title: 'Selecione um horário' });
      return;
    }

    this.agendamentoService.salvar(this.agendamento).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Agendamento criado!' });
        this.resetarFormulario();
        this.listarAgendamentos();
      },
      error: (err: any) =>
        Swal.fire({ icon: 'error', title: 'Erro', text: err.error?.message || err.error }),
    });
  }

  resetarFormulario() {
    this.agendamento = { inicio: '', cliente: { id: 0 }, empresa: { id: 0 }, servico: { id: 0 } };
    this.dataSelecionada = '';
    this.horarioSelecionado = null;
    this.horariosDisponiveis = [];
  }

  sair() {
    localStorage.clear();
    this.wsService.desconectar();
    this.router.navigate(['/login']);
  }
}
