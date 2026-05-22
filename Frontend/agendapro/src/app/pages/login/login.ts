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

export class Login{
  isCadastro = false;

  email = '';
  senha = '';

  usuario = {
    nome: '',
    email: '',
    senha: '',
    role: 'CLIENTE',
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

        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Login realizado',
        });

        this.router.navigate(['/servicos']);
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
    this.usuario.email = this.email;
    this.usuario.senha = this.senha;

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
}
