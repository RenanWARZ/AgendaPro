// cadastro.component.ts

import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  usuario = {
    nome: '',

    email: '',

    senha: '',

    documento: '',

    tipoPessoa: 'CPF',

    role: 'USUARIO',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  alterarTipoPessoa() {
    this.usuario.documento = '';

    if (this.usuario.tipoPessoa === 'CNPJ') {
      this.usuario.role = 'ADMIN';
    } else {
      this.usuario.role = 'USUARIO';
    }
  }

  cadastrar() {
    this.authService.cadastrar(this.usuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Usuário cadastrado',
        });

        this.router.navigate(['/login']);
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

  formatarCPF(event: any) {
    let valor = event.target.value;

    valor = valor.replace(/\D/g, '');
    valor = valor.substring(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.usuario.documento = valor;
  }

  formatarCNPJ(event: any) {
    let valor = event.target.value;

    valor = valor.replace(/\D/g, '');
    valor = valor.substring(0, 14);
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');

    this.usuario.documento = valor;
  }
}
