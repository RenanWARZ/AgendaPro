import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PreferenceRequest {
  agendamentoId: number;
  valor: number;
  nomeServico: string;
  pagadorEmail: string;
  pagadorNome: string;
}

export interface PreferenceResponse {
  preferenceId: string;
  checkoutUrl: string;
  sandboxUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private api = 'http://localhost:8080';
  private usarSandbox = true;

  constructor(private http: HttpClient) {}

  criarPreferencia(dados: PreferenceRequest): Observable<PreferenceResponse> {
    return this.http.post<PreferenceResponse>(`${this.api}/checkout/criar-preferencia`, dados);
  }

  consultarStatus(agendamentoId: number): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.api}/checkout/status/${agendamentoId}`);
  }
  redirecionar(response: PreferenceResponse): void {
    const url = this.usarSandbox ? response.sandboxUrl : response.checkoutUrl;
    window.location.href = url;
  }
}
