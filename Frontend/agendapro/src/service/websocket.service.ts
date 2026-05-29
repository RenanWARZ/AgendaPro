import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject } from 'rxjs';

declare var SockJS: any;

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client!: Client;
  private conectado = false;

  notificacaoAdmin$ = new Subject<any>();
  notificacaoUsuario$ = new Subject<any>();

  conectar(usuarioId: number, role: string) {

    // evita conectar duas vezes
    if (this.conectado) {
      console.log('WebSocket já conectado, ignorando...');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

      onConnect: () => {
        console.log('WebSocket conectado!');
        this.conectado = true;

        if (role === 'ADMIN') {
          this.client.subscribe('/topic/agendamentos', (msg: IMessage) => {
            console.log('Notificação ADMIN recebida:', msg.body);
            const notificacao = JSON.parse(msg.body);
            this.notificacaoAdmin$.next(notificacao);
          });
        }

        if (role === 'USUARIO') {
          this.client.subscribe(
            `/topic/usuario/${usuarioId}`,
            (msg: IMessage) => {
              console.log('Notificação USUARIO recebida:', msg.body);
              const notificacao = JSON.parse(msg.body);
              this.notificacaoUsuario$.next(notificacao);
            }
          );
        }
      },

      onDisconnect: () => {
        console.log('WebSocket desconectado.');
        this.conectado = false;
      },

      onStompError: (frame) => {
        console.error('Erro no STOMP:', frame);
        this.conectado = false;
      },

      // reconecta automaticamente a cada 5 segundos se cair
      reconnectDelay: 5000,
    });

    this.client.activate();
  }

  desconectar() {
    if (this.client && this.client.active) {
      this.client.deactivate();
      this.conectado = false;
    }
  }
}
