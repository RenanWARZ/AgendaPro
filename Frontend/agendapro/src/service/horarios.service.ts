import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {

  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  listarDisponiveis(profissionalId: number, data: string) {
    return this.http.get(`${this.api}/horarios/${profissionalId}/${data}`);
  }
}
