import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

import { ServicoService } from '../../../service/servico.service';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css',
})
export class Servicos implements OnInit {
  servicos: any[] = [];

  role = '';

  editando = false;

  servicoEditandoId = 0;

  servico = {
    nome: '',

    descricao: '',

    endereco: '',

    foto: '',

    preco: '',

    duracaoMinutos: '',

    profissional: {
      id: 0,
    },
  };

  constructor(
    private service: ServicoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.role = localStorage.getItem('role') || '';
    }

    this.listarServicos();
  }

  listarServicos() {
    const usuarioId = localStorage.getItem('usuarioId');

    this.service.listarServico(usuarioId).subscribe((res: any) => {
      this.servicos = res;
    });
  }


  salvar() {
    const usuarioId = localStorage.getItem('usuarioId');

    this.servico.profissional.id = Number(usuarioId);

    if (!this.servico.nome) {
      Swal.fire({
        icon: 'warning',
        title: 'Nome obrigatório',
      });

      return;
    }

    if (this.editando) {
      this.service.editar(this.servicoEditandoId, this.servico).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Serviço atualizado',
          });

          this.resetarFormulario();

          this.listarServicos();
        },

        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: err.error,
          });
        },
      });

      return;
    }

    this.service.salvar(this.servico).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Serviço criado',
        });

        this.resetarFormulario();

        this.listarServicos();
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

  editar(item: any) {
    this.editando = true;

    this.servicoEditandoId = item.id;

    this.servico = {
      nome: item.nome,

      descricao: item.descricao,

      endereco: item.endereco,

      foto: item.foto,

      preco: item.preco,

      duracaoMinutos: item.duracaoMinutos,

      profissional: {
        id: item.profissional?.id || 0,
      },
    };
  }

  excluir(id: number) {
    Swal.fire({
      title: 'Excluir serviço?',

      text: 'Essa ação não poderá ser desfeita.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Excluir',

      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.excluir(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Serviço excluído',
            });

            this.listarServicos();
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
    });
  }

  resetarFormulario() {
    this.editando = false;

    this.servicoEditandoId = 0;

    this.servico = {
      nome: '',

      descricao: '',

      endereco: '',

      foto: '',

      preco: '',

      duracaoMinutos: '',

      profissional: {
        id: 0,
      },
    };
  }

  sair() {
    localStorage.clear();

    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }
}
