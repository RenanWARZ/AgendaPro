import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listar(usuarioId: any) {
    return this.http.get(`${this.api}/agendamentos/usuario/${usuarioId}`);
  }

  listarPorServico(servicoId: number) {
    return this.http.get(`${this.api}/agendamentos/servico/${servicoId}`);
  }

  listarHorarios(servicoId: number, data: string) {
    return this.http.get(`${this.api}/agendamentos/horarios?servicoId=${servicoId}&data=${data}`);
  }

  salvar(agendamento: any) {
    return this.http.post(`${this.api}/agendamentos`, agendamento);
  }

  editar(id: number, inicio: string) {
    return this.http.put(`${this.api}/agendamentos/${id}`, { inicio });
  }

  cancelar(id: number) {
    return this.http.put(`${this.api}/agendamentos/cancelar/${id}`, {});
  }
}
