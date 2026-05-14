import { Servico } from './servico.model';

export interface Agendamento {
  id?: number;
  inicio: string;
  fim?: string;
  servico: Servico;
}
