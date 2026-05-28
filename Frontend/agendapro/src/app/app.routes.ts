import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Agendamentos } from './pages/agendamentos/agendamentos';
import { Servicos } from './pages/servicos/servicos';
import { Clientes } from './pages/clientes/clientes';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'agendamentos', component: Agendamentos, canActivate: [authGuard] },
  { path: 'servicos', component: Servicos, canActivate: [authGuard, adminGuard] },
  { path: 'clientes', component: Clientes, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '' },
];
