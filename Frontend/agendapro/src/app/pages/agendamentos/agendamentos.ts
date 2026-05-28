import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServicoService } from '../../../service/servico.service';
import { AgendamentoService } from '../../../service/agendamento.service';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './agendamentos.html',
  styleUrl: './agendamentos.css',
})
export class Agendamentos implements OnInit {
  role = '';

  agendamentos: any[] = [];
  servicos: any[] = [];
  horariosDisponiveis: any[] = [];
  horarioSelecionado: any = null;
  dataSelecionada = '';
  editandoId: number | null = null;
  dataEdicao = '';
  horarioEdicao: any = null;
  horariosEdicao: any[] = [];

  agendamento = {
    inicio: '',
    cliente: { id: 0 },
    empresa: { id: 0 },
    servico: { id: 0 },
  };

  constructor(
    private agendamentoService: AgendamentoService,
    private servicoService: ServicoService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.role = localStorage.getItem('role') || '';

      Promise.resolve().then(() => {
        this.listarAgendamentos();
        this.listarServicos();

        this.cd.detectChanges();
      });
    }
  }

  listarAgendamentos() {
    if (typeof window === 'undefined') return;

    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) return;

    this.agendamentoService.listar(usuarioId).subscribe((res: any) => {
      this.agendamentos = res;
      this.cd.detectChanges();
    });
  }

  listarServicos() {
    if (typeof window === 'undefined') return;

    setTimeout(() => {
      this.servicoService.listarTodos().subscribe((res: any) => {
        this.servicos = res;
        this.cd.detectChanges();
      });
    });
  }

  buscarHorarios() {
    console.log('DATA:', this.dataSelecionada);
    console.log('SERVICO:', this.agendamento.servico.id);

    if (!this.dataSelecionada || this.agendamento.servico.id === 0) {
      console.log('BLOQUEOU');
      return;
    }

    this.agendamentoService
      .listarHorarios(this.agendamento.servico.id, this.dataSelecionada)
      .subscribe({
        next: (res: any) => {
          console.log('HORARIOS BACKEND:', res);

          this.horariosDisponiveis = res;
        },

        error: (err) => {
          console.error('ERRO HORARIOS:', err);
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
    if (typeof window === 'undefined') return;

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
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Erro', text: err.error });
      },
    });
  }

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

  buscarHorariosEdicao(item: any) {
    if (!this.dataEdicao) return;

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
      Swal.fire({ icon: 'warning', title: 'Selecione uma data e horário' });
      return;
    }

    const novoInicio = `${this.dataEdicao}T${this.horarioEdicao.hora}:00`;

    this.agendamentoService.editar(this.editandoId!, novoInicio).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Agendamento atualizado!' });
        this.fecharEdicao();
        this.listarAgendamentos();
      },
      error: (err) => {
        Swal.fire({ icon: 'error', title: 'Erro', text: err.error });
      },
    });
  }

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
          this.listarAgendamentos();
        });
      }
    });
  }

  resetarFormulario() {
    this.agendamento = {
      inicio: '',
      cliente: { id: 0 },
      empresa: { id: 0 },
      servico: { id: 0 },
    };
    this.dataSelecionada = '';
    this.horarioSelecionado = null;
    this.horariosDisponiveis = [];
  }

  sair() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
