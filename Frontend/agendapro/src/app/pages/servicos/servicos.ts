import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  mostrarFormularioServico = false;
  diasSemana = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  servico = {
    nome: '',
    descricao: '',
    endereco: '',
    foto: '',
    preco: '',
    duracaoMinutos: '',
    diasFuncionamento: [] as string[],
    horaInicio: '',
    horaFim: '',
    intervaloMinutos: 30,
    profissional: {
      id: 0,
    },
  };

  constructor( private service: ServicoService, private router: Router, private cd: ChangeDetectorRef,) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.role = localStorage.getItem('role') || '';
      this.listarServicos();
    }
  }

  abrirServicos() {
    this.mostrarFormularioServico = !this.mostrarFormularioServico;
  }

  traduzirDia(dia: string): string {
    const dias: any = {
      MONDAY: 'Segunda',
      TUESDAY: 'Terça',
      WEDNESDAY: 'Quarta',
      THURSDAY: 'Quinta',
      FRIDAY: 'Sexta',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo',
    };
    return dias[dia] || dia;
  }

  toggleDia(dia: string) {
    const index = this.servico.diasFuncionamento.indexOf(dia);
    if (index > -1) {
      this.servico.diasFuncionamento.splice(index, 1);
    } else {
      this.servico.diasFuncionamento.push(dia);
    }
  }

  listarServicos() {
    if (typeof window === 'undefined') {
      return;
    }
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
      return;
    }
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
          this.mostrarFormularioServico = false;
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
        this.mostrarFormularioServico = false;
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
      diasFuncionamento: item.diasFuncionamento || [],
      horaInicio: item.horaInicio,
      horaFim: item.horaFim,
      intervaloMinutos: item.intervaloMinutos,
      profissional: {
        id: item.profissional?.id || 0,
      },
    };
    this.mostrarFormularioServico = true;
  }

  excluir(id: number) {
   Swal.fire({
  title: 'Excluir serviço?',
  text: 'Essa ação não poderá ser desfeita.',
  icon: 'error',
  showCancelButton: true,
  confirmButtonText: 'Excluir',
  confirmButtonColor: '#d11507',
  cancelButtonText: 'Cancelar',
  cancelButtonColor: '#000000',
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
      diasFuncionamento: [],
      horaInicio: '',
      horaFim: '',
      intervaloMinutos: 30,
      profissional: {
        id: 0,
      },
    };
  }

  formatarPreco(preco: number): string {
    return preco.toFixed(2).replace('.', ',');
  }

  sair() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }
}
