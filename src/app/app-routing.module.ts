import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./component/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
  { path: 'cadastro-empresa', loadChildren: () => import('./component/cadastro-empresa/cadastro-empresa.module').then(m => m.CadastroEmpresaModule) },
  { path: 'configuracao-documento', loadChildren: () => import('./component/configuracao-documento/configuracao-documento.module').then(m => m.ConfiguracaoDocumentoModule) },
  { path: 'assinatura', loadChildren: () => import('./component/assinaturas/assinaturas.module').then(m => m.AssinaturasModule) },
  { path: 'instrucoes', loadChildren: () => import('./component/instrucoes/instrucoes.module').then(m => m.InstrucoesModule) },
  { path: 'integracao', loadChildren: () => import('./component/manuais/integracao/integracao.module').then(m => m.IntegracaoModule) },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
