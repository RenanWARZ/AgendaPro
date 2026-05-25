import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {
  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  pagar(dados: any) {
    return this.http.post(`${this.api}/pagamentos`, dados);
  }
}
