import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AgendamentoService {

  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get(`${this.api}/agendamentos`);
  }

  salvar(agendamento: any) {
    return this.http.post(`${this.api}/agendamentos`, agendamento);
  }

  cancelar(id: number) {
    return this.http.put(`${this.api}/agendamentos/cancelar/${id}`, {});
  }
}
