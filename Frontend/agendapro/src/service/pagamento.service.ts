import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class PagamentoService {
  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  iniciar(dados: {
    agendamentoId: number;
    valor: number;
    metodo: string;
    pagadorEmail: string;
    pagadorDocumento: string;
    pagadorNome: string;
    cardToken?: string;
    installments?: number;
    issuerId?: string;
  }) {
    return this.http.post<any>(`${this.api}/pagamentos`, dados);
  }

  consultarStatus(agendamentoId: number) {
    return this.http.get<any>(`${this.api}/pagamentos/status/${agendamentoId}`);
  }
}
