import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServicoService {
  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listarServico(profissionalId: any) {
    return this.http.get(`${this.api}/servicos/profissional/${profissionalId}`);
  }

  listarTodos() {
    return this.http.get(`${this.api}/servicos`);
  }

  salvar(servico: any) {
    return this.http.post(`${this.api}/servicos`, servico);
  }

  editar(id: number, servico: any) {
    return this.http.put(`${this.api}/servicos/${id}`, servico);
  }

  excluir(id: number) {
    return this.http.delete(`${this.api}/servicos/${id}`);
  }
}
