import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css'],
})

export class Cadastro {

  formLogin;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
   this.formLogin = this.fb.group({
    nome: ['', Validators.required],
    email: ['', Validators.required],
    senha: ['', Validators.required],
    telefone: [''],
    role: ['CLIENTE'],
  });
}

  cadastrar() {
    this.auth.cadastrar(this.formLogin.value as any).subscribe({
      next: () => {
        alert('Cadastro realizado');
        this.router.navigate(['']);
      },
    });
  }
}
