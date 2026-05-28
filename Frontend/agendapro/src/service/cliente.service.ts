import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listarPorServico(servicoId: number) {
    return this.http.get(`${this.api}/agendamentos/servico/${servicoId}`);
  }

  listarServicos(profissionalId: number) {
    return this.http.get(`${this.api}/servicos/profissional/${profissionalId}`);
  }
}
