import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './model/usuario.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = 'http://localhost:8080';
  constructor(private http: HttpClient) {}
  cadastrar(user: User): Observable<User> {
    return this.http.post<User>(`${this.api}/usuarios`, user);
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.api}/login`, {
      email,
      senha,
    });
  }
  salvarToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  logout() {
    localStorage.removeItem('token');
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
