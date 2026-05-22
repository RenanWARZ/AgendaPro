import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../../../service/agendamento.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './agendamentos.html',
  styleUrl: './agendamentos.css',
})

export class Agendamentos implements OnInit {
  agendamentos: any[] = [];

  agendamento = {
    inicio: '',
    cliente: {
      id: 1,
    },
    profissional: {
      id: 1,
    },
    servico: {
      id: 1,
    },
  };

  constructor(private service: AgendamentoService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.service.listar().subscribe((res: any) => {
      this.agendamentos = res;
    });
  }

  salvar() {
    this.service.salvar(this.agendamento).subscribe(() => {
      this.listar();
    });
  }

  cancelar(id: number) {
    this.service.cancelar(id).subscribe(() => {
      this.listar();
    });
  }
}
