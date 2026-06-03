package com.agendapro.Service;

import com.agendapro.DTO.PreferenceRequestDTO;
import com.agendapro.DTO.PreferenceResponseDTO;
import com.agendapro.Enum.StatusAgendamento;
import com.agendapro.Exception.RecursoNaoEncontradoException;
import com.agendapro.Exception.RegraDeNegocioException;
import com.agendapro.Model.Agendamento;
import com.agendapro.Model.Pagamento;
import com.agendapro.Repository.AgendamentoRepository;
import com.agendapro.Repository.PagamentoRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final PagamentoRepository pagamentoRepository;
    private final AgendamentoRepository agendamentoRepository;

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    public PreferenceResponseDTO criarPreferencia(PreferenceRequestDTO dto) {

        // ✅ Validações antes de chamar o MP
        if (dto.getPagadorEmail() == null || dto.getPagadorEmail().isBlank()) {
            throw new RegraDeNegocioException("E-mail do pagador é obrigatório");
        }
        if (dto.getPagadorNome() == null || dto.getPagadorNome().isBlank()) {
            throw new RegraDeNegocioException("Nome do pagador é obrigatório");
        }

        Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Agendamento não encontrado: id=" + dto.getAgendamentoId()));

        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .id(dto.getAgendamentoId().toString())
                    .title("AgendaPro - " + dto.getNomeServico())
                    .description("Agendamento #" + dto.getAgendamentoId())
                    .quantity(1)
                    .unitPrice(BigDecimal.valueOf(dto.getValor()))
                    .currencyId("BRL")
                    .build();

            PreferencePayerRequest payer = PreferencePayerRequest.builder()
                    .email(dto.getPagadorEmail())
                    .name(dto.getPagadorNome())
                    .build();

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(frontendUrl + "/agendamentos?pagamento=sucesso&agendamentoId=" + dto.getAgendamentoId())
                    .failure(frontendUrl + "/agendamentos?pagamento=falha&agendamentoId=" + dto.getAgendamentoId())
                    .pending(frontendUrl + "/agendamentos?pagamento=pendente&agendamentoId=" + dto.getAgendamentoId())
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(List.of(item))
                    .payer(payer)
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .externalReference("AGENDAPRO-" + dto.getAgendamentoId())
                    .statementDescriptor("AgendaPro")
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            Pagamento pagamento = new Pagamento();
            pagamento.setValor(dto.getValor());
            pagamento.setMetodo("checkout_pro");
            pagamento.setAgendamento(agendamento);
            pagamento.setExternalId(preference.getId());
            pagamento.setStatus("PENDENTE");
            pagamentoRepository.save(pagamento);

            return PreferenceResponseDTO.builder()
                    .preferenceId(preference.getId())
                    .checkoutUrl(preference.getInitPoint())
                    .sandboxUrl(preference.getSandboxInitPoint())
                    .build();

        } catch (MPApiException e) {
            System.err.println("ERRO MP API: " + e.getApiResponse().getContent());
            throw new RegraDeNegocioException(
                    "Mercado Pago rejeitou a requisição: " + e.getApiResponse().getContent());
        } catch (MPException e) {
            System.err.println("ERRO MP conexão: " + e.getMessage());
            throw new RuntimeException("Erro ao conectar com Mercado Pago: " + e.getMessage());
        }
    }

    public void processarWebhook(String paymentId) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);
            PaymentClient client = new PaymentClient();
            Payment mpPayment = client.get(Long.parseLong(paymentId));

            String externalRef = mpPayment.getExternalReference();
            if (externalRef != null && externalRef.startsWith("AGENDAPRO-")) {
                Long agendamentoId = Long.parseLong(externalRef.replace("AGENDAPRO-", ""));

                Agendamento agendamento = agendamentoRepository.findById(agendamentoId).orElse(null);

                pagamentoRepository.findByAgendamentoId(agendamentoId).ifPresent(pagamento -> {
                    String novoStatus = mapStatus(mpPayment.getStatus());
                    pagamento.setStatus(novoStatus);
                    pagamento.setExternalId(paymentId);
                    pagamentoRepository.save(pagamento);

                    if (agendamento != null) {
                        if ("APROVADO".equals(novoStatus)) {
                            agendamento.setStatus(StatusAgendamento.CONFIRMADO);
                        } else if ("CANCELADO".equals(novoStatus) || "RECUSADO".equals(novoStatus)) {
                            agendamento.setStatus(StatusAgendamento.CANCELADO);
                        }
                        agendamentoRepository.save(agendamento);
                    }
                });
            }
        } catch (MPException | MPApiException e) {
            throw new RuntimeException("Erro ao processar webhook: " + e.getMessage());
        }
    }

    public String consultarStatus(Long agendamentoId) {
        return pagamentoRepository.findByAgendamentoId(agendamentoId)
                .map(Pagamento::getStatus)
                .orElse("NAO_INICIADO");
    }

    private String mapStatus(String status) {
        if (status == null) return "PENDENTE";
        return switch (status.toLowerCase()) {
            case "approved"  -> "APROVADO";
            case "rejected"  -> "RECUSADO";
            case "cancelled" -> "CANCELADO";
            default          -> "PENDENTE";
        };
    }
}