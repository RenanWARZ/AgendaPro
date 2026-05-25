import { Component, OnInit } from '@angular/core';
import { ServicoService } from '../../../service/servico.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  servico = {
    nome: '',
    preco: 0,
    duracaoMinutos: 0,
  };

  constructor(private service: ServicoService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.role = localStorage.getItem('role') || '';
    }
    this.listar();
  }

  listar() {
    this.service.listar().subscribe((res: any) => {
      this.servicos = res;
    });
  }

  salvar() {
    this.service.salvar(this.servico).subscribe(() => {
      this.listar();
    });
  }
}
