import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(dados: any) {
    return this.http.post(`${this.api}/auth/login`, dados);
  }

  cadastrar(usuario: any) {
    return this.http.post(`${this.api}/usuarios`, usuario);
  }
}
