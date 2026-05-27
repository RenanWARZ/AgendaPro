import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private clienteService: ClienteService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.listar();
    this.cd.detectChanges();
  }

  listar() {
    this.clienteService.listar().subscribe({
      next: (res: any) => {
        console.log(res);

        this.clientes = res;
        this.cd.detectChanges();
      },

      error: (err) => {
        console.log(err);
      },

    });
  }
}
