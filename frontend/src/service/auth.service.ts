import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, LoginPayload, UsuarioCreate } from './model/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private authUrl = 'http://localhost:8080/auth';
  private jogadorUrl = 'http://localhost:8080/usuario';

  criarConta(payload: UsuarioCreate): Observable<any> {
    return this.http.post<any>(`${this.jogadorUrl}/cadastro`, payload);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, payload);
  }
}
