import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ContratoComponent } from './contrato/contrato.component';

const routes: Routes = [
{
    path: '',
    component: ContratoComponent, // Rota raiz carrega esse componente
    pathMatch: 'full'
  },
  {
    path: 'contrato',
    component: ContratoComponent,
    pathMatch: 'full'
  },
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
  { path: 'instrucoes', loadChildren: () => import('./component/instrucoes/instrucoes.module').then(m => m.InstrucoesModule) },
  { path: 'painel', loadChildren: () => import('./component/painel/painel.module').then(m => m.PainelModule) },
  { path: 'chamado', loadChildren: () => import('./component/chamado/chamado.module').then(m => m.ChamadoModule) }, 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
