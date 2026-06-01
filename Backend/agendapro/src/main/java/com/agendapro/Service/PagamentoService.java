package com.agendapro.Service;

import com.agendapro.DTO.PagamentoRequestDTO;
import com.agendapro.DTO.PagamentoResponseDTO;
import com.agendapro.Model.Agendamento;
import com.agendapro.Model.Pagamento;
import com.agendapro.Repository.AgendamentoRepository;
import com.agendapro.Repository.PagamentoRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;
    private final AgendamentoRepository agendamentoRepository;

    @Value("${mercadopago.access-token}")
    private String accessToken;

    // ─────────────────────────────────────────
    // Iniciar pagamento (Pix ou Cartão)
    // ─────────────────────────────────────────
    public PagamentoResponseDTO iniciar(PagamentoRequestDTO dto) {
        Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        try {
            MercadoPagoConfig.setAccessToken(accessToken);
            PaymentClient client = new PaymentClient();

            PaymentCreateRequest request = buildRequest(dto, agendamento);
            Payment mpPayment = client.create(request);

            Pagamento pagamento = salvarPagamento(dto, agendamento, mpPayment);

            return toResponse(pagamento);

        } catch (MPApiException e) {
            throw new RuntimeException("Erro na API do Mercado Pago: " + e.getApiResponse().getContent());
        } catch (MPException e) {
            throw new RuntimeException("Erro ao conectar com Mercado Pago: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────
    // Webhook — recebe notificações do MP
    // ─────────────────────────────────────────
    public void processarWebhook(String externalId) {
        pagamentoRepository.findByExternalId(externalId).ifPresent(pagamento -> {
            try {
                MercadoPagoConfig.setAccessToken(accessToken);
                PaymentClient client = new PaymentClient();

                Payment mpPayment = client.get(Long.parseLong(externalId));
                String novoStatus = mapStatus(mpPayment.getStatus());

                pagamento.setStatus(novoStatus);
                pagamentoRepository.save(pagamento);

            } catch (MPException | MPApiException e) {
                throw new RuntimeException("Erro ao consultar webhook: " + e.getMessage());
            }
        });
    }

    // ─────────────────────────────────────────
    // Consultar status atual
    // ─────────────────────────────────────────
    public PagamentoResponseDTO consultarStatus(Long agendamentoId) {
        Pagamento pagamento = pagamentoRepository.findByAgendamentoId(agendamentoId)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        // Atualiza do MP em tempo real
        try {
            MercadoPagoConfig.setAccessToken(accessToken);
            PaymentClient client = new PaymentClient();
            Payment mpPayment = client.get(Long.parseLong(pagamento.getExternalId()));
            pagamento.setStatus(mapStatus(mpPayment.getStatus()));
            pagamentoRepository.save(pagamento);
        } catch (Exception ignored) {
            // Se falhar, retorna o status salvo localmente
        }

        return toResponse(pagamento);
    }

    // ─────────────────────────────────────────
    // Helpers privados
    // ─────────────────────────────────────────
    private PaymentCreateRequest buildRequest(PagamentoRequestDTO dto, Agendamento agendamento) {
        PaymentPayerRequest payer = PaymentPayerRequest.builder()
                .email(dto.getPagadorEmail())
                .build();

        PaymentCreateRequest.PaymentCreateRequestBuilder builder = PaymentCreateRequest.builder()
                .transactionAmount(BigDecimal.valueOf(dto.getValor()))
                .description("AgendaPro - " + agendamento.getServico().getNome())
                .paymentMethodId(dto.getMetodo())
                .payer(payer);

        if ("credit_card".equals(dto.getMetodo())) {
            builder
                    .token(dto.getCardToken())
                    .installments(dto.getInstallments())
                    .issuerId(dto.getIssuerId());
        }

        return builder.build();
    }

    private Pagamento salvarPagamento(PagamentoRequestDTO dto, Agendamento agendamento, Payment mpPayment) {
        Pagamento pagamento = new Pagamento();
        pagamento.setValor(dto.getValor());
        pagamento.setMetodo(dto.getMetodo());
        pagamento.setAgendamento(agendamento);
        pagamento.setExternalId(mpPayment.getId().toString());
        pagamento.setStatus(mapStatus(mpPayment.getStatus()));

        // Dados do Pix
        if ("pix".equals(dto.getMetodo()) && mpPayment.getPointOfInteraction() != null) {
            var txInfo = mpPayment.getPointOfInteraction().getTransactionData();
            if (txInfo != null) {
                pagamento.setPixQrCode(txInfo.getQrCodeBase64());
                pagamento.setPixQrCodeTexto(txInfo.getQrCode());
            }
        }

        return pagamentoRepository.save(pagamento);
    }

    private String mapStatus(String status) {
        if (status == null) return "PENDENTE";
        return switch (status.toLowerCase()) {
            case "approved"           -> "APROVADO";
            case "rejected"           -> "RECUSADO";
            case "cancelled"          -> "CANCELADO";
            default                   -> "PENDENTE"; // pending, in_process, authorized, etc.
        };
    }

    private PagamentoResponseDTO toResponse(Pagamento p) {
        return PagamentoResponseDTO.builder()
                .id(p.getId())
                .status(p.getStatus())
                .metodo(p.getMetodo())
                .valor(p.getValor())
                .externalId(p.getExternalId())
                .pixQrCode(p.getPixQrCode())
                .pixQrCodeTexto(p.getPixQrCodeTexto())
                .build();
    }
}
