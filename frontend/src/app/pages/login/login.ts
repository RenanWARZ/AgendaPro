import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

  login() {
    const { email, senha } = this.form.value;

    this.auth.login(email!, senha!).subscribe({
      next: (res) => {
        this.auth.salvarToken(res.token);
        this.router.navigate(['/dashboard']);
      },
    });
  }
}
