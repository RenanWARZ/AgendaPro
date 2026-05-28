import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})

export class Clientes implements OnInit {
  agendamentos: any[] = [];
  servicos: any[] = [];
  servicoSelecionadoId = 0;
  role = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.role = localStorage.getItem('role') || '';
      const usuarioId = Number(localStorage.getItem('usuarioId'));
      this.carregarServicos(usuarioId);
    }
  }

  carregarServicos(profissionalId: number) {
    this.clienteService.listarServicos(profissionalId).subscribe({
      next: (res: any) => {
        this.servicos = res;

        if (this.servicos.length > 0) {
          this.servicoSelecionadoId = this.servicos[0].id;
          this.listar();
        }
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  listar() {
    if (!this.servicoSelecionadoId) return;

    this.clienteService.listarPorServico(this.servicoSelecionadoId).subscribe({
      next: (res: any) => {
        this.agendamentos = res;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  sair() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
