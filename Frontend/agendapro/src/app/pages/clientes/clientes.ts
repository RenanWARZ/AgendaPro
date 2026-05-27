import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})

export class Clientes implements OnInit {
  clientes: any[] = [];
  role = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.role = localStorage.getItem('role') || '';
    }
    this.listar();
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

  sair() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
