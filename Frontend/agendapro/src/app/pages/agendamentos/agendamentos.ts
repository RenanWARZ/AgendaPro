import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { RouterLink, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { ServicoService } from '../../../service/servico.service';

import { PagamentoService } from '../../../service/pagamento.service';

import { AgendamentoService } from '../../../service/agendamento.service';

import { ClienteService } from '../../../service/cliente.service';

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

  clientes: any[] = [];

  servicos: any[] = [];

  horarios = [
    { id: 1, hora: '08:00' },
    { id: 2, hora: '08:30' },
    { id: 3, hora: '09:00' },
    { id: 4, hora: '09:30' },
    { id: 5, hora: '10:00' },
    { id: 6, hora: '10:30' },
    { id: 7, hora: '11:00' },
    { id: 8, hora: '11:30' },
    { id: 9, hora: '12:00' },
    { id: 10, hora: '12:30' },
    { id: 11, hora: '13:00' },
    { id: 12, hora: '13:30' },
    { id: 13, hora: '14:00' },
    { id: 14, hora: '14:30' },
    { id: 15, hora: '15:00' },
    { id: 16, hora: '15:30' },
    { id: 17, hora: '16:00' },
    { id: 18, hora: '16:30' },
    { id: 19, hora: '17:00' },
    { id: 20, hora: '17:30' },
    { id: 21, hora: '18:00' },
  ];

  horarioSelecionado: any = null;

  dataSelecionada = '';

  agendamento = {
    inicio: '',

    cliente: {
      id: 0,
    },

    profissional: {
      id: 0,
    },

    servico: {
      id: 0,
    },
  };

  pagamento = {
    valor: 0,

    metodo: 'PIX',

    agendamento: {
      id: 0,
    },
  };

  constructor(
    private agendamentoService: AgendamentoService,

    private clienteService: ClienteService,

    private servicoService: ServicoService,

    private pagamentoService: PagamentoService,

    private router: Router,

    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.role = localStorage.getItem('role') || '';
    }

    this.listarAgendamentos();

    this.listarClientes();

    this.listarServicos();
  }

  listarAgendamentos() {
    if (typeof window === 'undefined') {
      return;
    }

    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
      return;
    }

    this.agendamentoService.listar(usuarioId).subscribe((res: any) => {
      this.agendamentos = res;

      this.cd.detectChanges();
    });
  }

  listarClientes() {
    if (typeof window === 'undefined') {
      return;
    }

    this.clienteService.listar().subscribe((res: any) => {
      this.clientes = res;

      this.cd.detectChanges();
    });
  }

  listarServicos() {
    if (typeof window === 'undefined') {
      return;
    }

    setTimeout(() => {
      this.servicoService.listarTodos().subscribe((res: any) => {
        this.servicos = res;

        this.cd.detectChanges();
      });
    });
  }

  selecionarServico(item: any) {
    this.agendamento.servico.id = item.id;

    this.agendamento.profissional.id = item.profissional.id;
  }

  selecionarHorario(horario: any) {
    this.horarioSelecionado = horario;

    this.agendamento.inicio = `${this.dataSelecionada}T${horario.hora}:00`;
  }

  salvar() {
    if (typeof window === 'undefined') {
      return;
    }

    const usuarioId = localStorage.getItem('usuarioId');

    if (this.role === 'USUARIO') {
      this.agendamento.cliente.id = Number(usuarioId);
    }

    if (!this.dataSelecionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecione uma data',
      });

      return;
    }

    if (this.role === 'ADMIN' && this.agendamento.cliente.id === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecione um cliente',
      });

      return;
    }

    if (this.agendamento.servico.id === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecione um serviço',
      });

      return;
    }

    if (!this.agendamento.inicio) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecione um horário',
      });

      return;
    }

    this.agendamentoService.salvar(this.agendamento).subscribe({
      next: (res: any) => {
        this.pagamento.valor = res.servico.preco;

        this.pagamento.agendamento.id = res.id;

        Swal.fire({
          icon: 'success',
          title: 'Agendamento criado',
        });

        this.listarAgendamentos();
      },

      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: err.error,
        });
      },
    });
  }

  cancelar(id: number) {
    this.agendamentoService.cancelar(id).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Reserva cancelada',
      });

      this.listarAgendamentos();
    });
  }

  pagar() {
    this.pagamentoService.pagar(this.pagamento).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Pagamento confirmado',
        });
      },

      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: err.error,
        });
      },
    });
  }

  sair() {
    localStorage.removeItem('usuario');

    localStorage.removeItem('usuarioId');

    localStorage.removeItem('role');

    this.router.navigate(['/']);
  }
}
