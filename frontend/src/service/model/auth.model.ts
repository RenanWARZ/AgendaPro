export interface UsuarioCreate {
  nome: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
}
