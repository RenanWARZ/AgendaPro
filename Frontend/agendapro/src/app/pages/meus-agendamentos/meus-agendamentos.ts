import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AgendamentoService } from '../../../service/agendamento.service';
import { WebsocketService } from '../../../service/websocket.service';
import { Checkout } from '../checkout/checkout';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meus-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, Checkout],
  templateUrl: './meus-agendamentos.html',
  styleUrl: './meus-agendamentos.css',
})
export class MeusAgendamentos implements OnInit, OnDestroy {
  role = '';
  agendamentos: any[] = [];

  termoBusca = '';
  filtroStatus: 'TODOS' | 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' = 'TODOS';

  checkoutAberto = false;
  agendamentoParaPagar: any = null;

  editandoId: number | null = null;
  dataEdicao = '';
  horarioEdicao: any = null;
  horariosEdicao: any[] = [];

  private subs: Subscription[] = [];
  private inscrito = false;

  constructor(
    private agendamentoService: AgendamentoService,
    private wsService: WebsocketService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.role = localStorage.getItem('role') || '';

    Promise.resolve().then(() => {
      this.listar();
      this.cd.detectChanges();

      if (!this.inscrito) {
        this.inscrito = true;
        const usuarioId = Number(localStorage.getItem('usuarioId'));
        this.wsService.conectar(usuarioId, this.role);

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
            this.listar();
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

  listar() {
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) return;
    this.agendamentoService.listar(usuarioId).subscribe((res: any) => {
      this.agendamentos = res;
      this.cd.detectChanges();
    });
  }

  get agendamentosFiltrados(): any[] {
    return this.agendamentos.filter((a) => {
      const matchStatus = this.filtroStatus === 'TODOS' || a.status === this.filtroStatus;
      const q = this.termoBusca.toLowerCase();
      const matchBusca =
        !q ||
        a.servico?.nome?.toLowerCase().includes(q) ||
        a.cliente?.nome?.toLowerCase().includes(q) ||
        a.empresa?.nome?.toLowerCase().includes(q);
      return matchStatus && matchBusca;
    });
  }

  // ── Cancelar ──────────────────────────────────────────────────────────────
  cancelar(id: number) {
    Swal.fire({
      title: 'Cancelar agendamento?',
      text: 'Essa ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Voltar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.agendamentoService.cancelar(id).subscribe(() => {
          Swal.fire({ icon: 'success', title: 'Agendamento cancelado' });
          this.listar();
        });
      }
    });
  }

  // ── Checkout ──────────────────────────────────────────────────────────────
  abrirCheckout(item: any) {
    this.agendamentoParaPagar = item;
    this.checkoutAberto = true;
    this.cd.detectChanges();
  }

  fecharCheckout() {
    this.checkoutAberto = false;
    this.agendamentoParaPagar = null;
    this.cd.detectChanges();
  }

  // ── Edição ────────────────────────────────────────────────────────────────
  abrirEdicao(item: any) {
    this.editandoId = item.id;
    this.dataEdicao = '';
    this.horarioEdicao = null;
    this.horariosEdicao = [];
  }

  fecharEdicao() {
    this.editandoId = null;
    this.dataEdicao = '';
    this.horarioEdicao = null;
    this.horariosEdicao = [];
  }

  buscarHorariosEdicao() {
    if (!this.dataEdicao || this.editandoId === null) return;
    const item = this.agendamentos.find((a) => a.id === this.editandoId);
    if (!item) return;
    this.agendamentoService
      .listarHorarios(item.servico.id, this.dataEdicao)
      .subscribe((res: any) => {
        this.horariosEdicao = res;
        this.cd.detectChanges();
      });
  }

  selecionarHorarioEdicao(horario: any) {
    if (!horario.disponivel) return;
    this.horarioEdicao = horario;
  }

  confirmarEdicao() {
    if (!this.dataEdicao || !this.horarioEdicao) {
      Swal.fire({ icon: 'warning', title: 'Selecione data e horário' });
      return;
    }
    const novoInicio = `${this.dataEdicao}T${this.horarioEdicao.hora}:00`;
    this.agendamentoService.editar(this.editandoId!, novoInicio).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Agendamento atualizado!' });
        this.fecharEdicao();
        this.listar();
      },
      error: (err: any) =>
        Swal.fire({ icon: 'error', title: 'Erro', text: err.error?.message || err.error }),
    });
  }

  // ── Navegação ─────────────────────────────────────────────────────────────
  sair() {
    localStorage.clear();
    this.wsService.desconectar();
    this.router.navigate(['/login']);
  }

  trackById(_: number, item: any) {
    return item.id;
  }
}
