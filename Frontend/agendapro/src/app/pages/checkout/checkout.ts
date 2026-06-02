import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CheckoutService } from '../../../service/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  @Input() agendamentoId!: number;
  @Input() valor!: number;
  @Input() nomeServico!: string;
  @Output() fechar = new EventEmitter<void>();

  carregando = false;
  pagadorNome = '';
  pagadorEmail = '';

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    this.pagadorEmail = localStorage.getItem('email') || '';
    this.pagadorNome = localStorage.getItem('nome') || '';
  }

  iniciarPagamento(): void {
    if (!this.pagadorEmail || !this.pagadorNome) {
      Swal.fire({ icon: 'warning', title: 'Preencha nome e e-mail para continuar.' });
      return;
    }

    console.log('Enviando:', {
      agendamentoId: this.agendamentoId,
      valor: this.valor,
      nomeServico: this.nomeServico,
    });

    this.carregando = true;
    this.carregando = true;

    this.checkoutService
      .criarPreferencia({
        agendamentoId: this.agendamentoId,
        valor: this.valor,
        nomeServico: this.nomeServico,
        pagadorEmail: this.pagadorEmail,
        pagadorNome: this.pagadorNome,
      })
      .subscribe({
        next: (res) => {
          this.checkoutService.redirecionar(res);
        },
        error: (err) => {
          this.carregando = false;
          Swal.fire({
            icon: 'error',
            title: 'Erro ao iniciar pagamento',
            text: err.error?.message || 'Tente novamente.',
          });
        },
      });
  }

  fecharModal(): void {
    this.fechar.emit();
  }
}
