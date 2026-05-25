import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, RouterLink],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})

export class Clientes implements OnInit {

  clientes: any[] = [];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.listar();
    }
  }

  listar() {
    this.clienteService.listar().subscribe({
      next: (res: any) => {
        this.clientes = res;

        console.log(this.clientes);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }
}
