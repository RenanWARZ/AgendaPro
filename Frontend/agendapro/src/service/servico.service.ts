import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ServicoService {
  
  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get(`${this.api}/servicos`);
  }

  salvar(servico: any) {
    return this.http.post(`${this.api}/servicos`, servico);
  }
}
