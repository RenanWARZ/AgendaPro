import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servico } from './model/servico.model';

@Injectable({
  providedIn: 'root',
})

export class ServicoService {

  private api = 'http://localhost:8080/servicos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.api);
  }

  salvar(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(this.api, servico);
  }
  
}
