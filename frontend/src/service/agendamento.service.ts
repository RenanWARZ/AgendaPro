import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from './model/agendamento.model';

@Injectable({
  providedIn: 'root',
})

export class AgendamentoService {

  private api = 'http://localhost:8080/agendamentos';

  constructor(private http: HttpClient) {}

  criar(agendamento: Agendamento): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.api, agendamento);
  }

}
