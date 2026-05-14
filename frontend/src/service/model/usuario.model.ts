export interface User {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  categoriaServico?: string;
  role: 'CLIENTE' | 'PROFISSIONAL' | 'ADMIN';
}
