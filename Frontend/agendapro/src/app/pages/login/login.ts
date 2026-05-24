import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  isCadastro = false;

  email = '';

  senha = '';

  usuario = {
    nome: '',

    email: '',

    senha: '',

    documento: '',

    tipoPessoa: 'CPF',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  entrar() {
    const dados = {
      email: this.email,

      senha: this.senha,
    };

    this.authService.login(dados).subscribe({
      next: (res: any) => {
        localStorage.setItem('usuario', JSON.stringify(res));

        localStorage.setItem('usuarioId', res.id);

        localStorage.setItem('role', res.role);

        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Login realizado',
        });

        this.router.navigate(['/agendamentos']);
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

  cadastrar() {
    const documento = this.usuario.documento.replace(/\D/g, '');

    if (this.usuario.tipoPessoa === 'CPF' && documento.length !== 11) {
      Swal.fire({
        icon: 'warning',
        title: 'CPF inválido',
        text: 'Digite um CPF válido',
      });

      return;
    }

    if (this.usuario.tipoPessoa === 'CNPJ' && documento.length !== 14) {
      Swal.fire({
        icon: 'warning',
        title: 'CNPJ inválido',
        text: 'Digite um CNPJ válido',
      });

      return;
    }

    if (!this.usuario.email.includes('@')) {
      Swal.fire({
        icon: 'warning',
        title: 'E-mail inválido',
        text: 'Digite um e-mail válido',
      });

      return;
    }

    if (this.usuario.senha.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Senha fraca',
        text: 'A senha precisa ter pelo menos 6 caracteres',
      });

      return;
    }

    this.authService.cadastrar(this.usuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Usuário cadastrado',
        });

        this.isCadastro = false;
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

  alterarTipoPessoa() {
    this.usuario.documento = '';
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
