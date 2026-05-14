import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Login },
  {path: 'cadastro', component: Cadastro},
  {path: 'dashboard', component: Dashboard},

];
