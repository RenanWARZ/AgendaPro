import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Servicos } from './pages/servicos/servicos';
import { Cadastro } from './pages/cadastro/cadastro';
import { Agendamentos } from './pages/agendamentos/agendamentos';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'servicos', component: Servicos },
  { path: 'agendamentos', component: Agendamentos },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
