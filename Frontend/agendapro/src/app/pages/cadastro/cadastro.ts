import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})

export class Cadastro{
  usuario = {
    nome: '',
    email: '',
    senha: '',
    role: 'CLIENTE',
  };

  constructor(private authService: AuthService) {}

  cadastrar() {
    this.authService.cadastrar(this.usuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Usuário cadastrado',
        });
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
