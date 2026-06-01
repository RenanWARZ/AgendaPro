import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagamentoService } from '../../../service/pagamento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, OnDestroy {
  @Input() agendamentoId!: number;
  @Input() valor!: number;
  @Input() nomeServico!: string;
  @Output() fechar = new EventEmitter<void>();
  @Output() pagoCom = new EventEmitter<string>(); // emite o status final

  metodo: 'pix' | 'credit_card' = 'pix';
  carregando = false;
  etapa: 'escolha' | 'pix' | 'cartao' | 'aguardando' | 'resultado' = 'escolha';

  // Dados do pagador
  pagadorNome = '';
  pagadorEmail = '';
  pagadorDocumento = '';

  // Pix
  pixQrCode = '';
  pixQrCodeTexto = '';
  pixCopiado = false;

  // Cartão
  numeroCartao = '';
  nomeCartao = '';
  validade = '';
  cvv = '';
  parcelas = 1;
  parcelasOpcoes: { valor: number; label: string }[] = [];

  // Polling de status
  private pollingInterval: any;
  statusPagamento = '';
  agendamentoPagamentoId: number | null = null;

  constructor(private pagamentoService: PagamentoService) {}

  ngOnInit(): void {
    // Preenche email do usuário logado se disponível
    this.pagadorEmail = localStorage.getItem('email') || '';
    this.pagadorNome = localStorage.getItem('nome') || '';
    this.pagadorDocumento = localStorage.getItem('documento') || '';
    this.gerarParcelasOpcoes();
  }

  ngOnDestroy(): void {
    this.pararPolling();
  }

  gerarParcelasOpcoes() {
    this.parcelasOpcoes = [];
    for (let i = 1; i <= 12; i++) {
      const valorParcela = this.valor / i;
      this.parcelasOpcoes.push({
        valor: i,
        label:
          i === 1
            ? `1x de R$ ${valorParcela.toFixed(2)} (sem juros)`
            : `${i}x de R$ ${valorParcela.toFixed(2)}`,
      });
    }
  }

  selecionarMetodo(m: 'pix' | 'credit_card') {
    this.metodo = m;
    this.etapa = m === 'pix' ? 'pix' : 'cartao';
  }

  voltarEscolha() {
    this.etapa = 'escolha';
  }

  // ─────────────────────────────────────────
  // Pagar com Pix
  // ─────────────────────────────────────────
  pagarPix() {
    if (!this.pagadorEmail || !this.pagadorDocumento || !this.pagadorNome) {
      Swal.fire({ icon: 'warning', title: 'Preencha seus dados para continuar.' });
      return;
    }

    this.carregando = true;

    this.pagamentoService
      .iniciar({
        agendamentoId: this.agendamentoId,
        valor: this.valor,
        metodo: 'pix',
        pagadorEmail: this.pagadorEmail,
        pagadorDocumento: this.pagadorDocumento.replace(/\D/g, ''),
        pagadorNome: this.pagadorNome,
      })
      .subscribe({
        next: (res) => {
          this.carregando = false;
          this.pixQrCode = res.pixQrCode;
          this.pixQrCodeTexto = res.pixQrCodeTexto;
          this.agendamentoPagamentoId = this.agendamentoId;
          this.etapa = 'aguardando';
          this.iniciarPolling();
        },
        error: (err) => {
          this.carregando = false;
          Swal.fire({
            icon: 'error',
            title: 'Erro ao gerar Pix',
            text: err.error?.message || 'Tente novamente.',
          });
        },
      });
  }

  copiarPix() {
    navigator.clipboard.writeText(this.pixQrCodeTexto).then(() => {
      this.pixCopiado = true;
      setTimeout(() => (this.pixCopiado = false), 3000);
    });
  }

  // ─────────────────────────────────────────
  // Pagar com Cartão
  // ─────────────────────────────────────────
  pagarCartao() {
    if (!this.pagadorEmail || !this.pagadorDocumento || !this.pagadorNome) {
      Swal.fire({ icon: 'warning', title: 'Preencha seus dados para continuar.' });
      return;
    }
    if (!this.numeroCartao || !this.nomeCartao || !this.validade || !this.cvv) {
      Swal.fire({ icon: 'warning', title: 'Preencha todos os dados do cartão.' });
      return;
    }

    this.carregando = true;

    // Tokeniza o cartão usando o SDK do Mercado Pago (MercadoPago.js)
    // O SDK deve estar carregado no index.html via script tag:
    // <script src="https://sdk.mercadopago.com/js/v2"></script>
    const mp = (window as any).MercadoPago;
    if (!mp) {
      Swal.fire({ icon: 'error', title: 'SDK do Mercado Pago não carregado.' });
      this.carregando = false;
      return;
    }

    const [mes, ano] = this.validade.split('/');
    const mpInstance = new mp('SUA_PUBLIC_KEY_AQUI'); // ← substitua pela sua Public Key

    mpInstance
      .createCardToken({
        cardNumber: this.numeroCartao.replace(/\s/g, ''),
        cardholderName: this.nomeCartao,
        cardExpirationMonth: mes,
        cardExpirationYear: `20${ano}`,
        securityCode: this.cvv,
        identificationType: this.pagadorDocumento.replace(/\D/g, '').length === 11 ? 'CPF' : 'CNPJ',
        identificationNumber: this.pagadorDocumento.replace(/\D/g, ''),
      })
      .then((token: any) => {
        this.pagamentoService
          .iniciar({
            agendamentoId: this.agendamentoId,
            valor: this.valor,
            metodo: 'credit_card',
            pagadorEmail: this.pagadorEmail,
            pagadorDocumento: this.pagadorDocumento.replace(/\D/g, ''),
            pagadorNome: this.pagadorNome,
            cardToken: token.id,
            installments: this.parcelas,
          })
          .subscribe({
            next: (res) => {
              this.carregando = false;
              this.statusPagamento = res.status;
              this.etapa = 'resultado';
              this.pagoCom.emit(res.status);
            },
            error: (err) => {
              this.carregando = false;
              Swal.fire({
                icon: 'error',
                title: 'Pagamento recusado',
                text: err.error?.message || 'Verifique os dados do cartão.',
              });
            },
          });
      })
      .catch(() => {
        this.carregando = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao processar cartão',
          text: 'Verifique os dados e tente novamente.',
        });
      });
  }

  // ─────────────────────────────────────────
  // Polling de status do Pix
  // ─────────────────────────────────────────
  iniciarPolling() {
    this.pollingInterval = setInterval(() => {
      this.pagamentoService.consultarStatus(this.agendamentoId).subscribe({
        next: (res) => {
          if (res.status === 'APROVADO') {
            this.pararPolling();
            this.statusPagamento = 'APROVADO';
            this.etapa = 'resultado';
            this.pagoCom.emit('APROVADO');
          } else if (res.status === 'RECUSADO' || res.status === 'CANCELADO') {
            this.pararPolling();
            this.statusPagamento = res.status;
            this.etapa = 'resultado';
          }
        },
      });
    }, 5000); // verifica a cada 5 segundos
  }

  pararPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  fecharModal() {
    this.pararPolling();
    this.fechar.emit();
  }

  formatarCartao(event: any) {
    let value = event.target.value.replace(/\D/g, '').substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    this.numeroCartao = value;
  }

  formatarValidade(event: any) {
    let value = event.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 3) value = value.substring(0, 2) + '/' + value.substring(2);
    this.validade = value;
  }
}
