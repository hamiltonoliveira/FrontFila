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
  { path: 'grupo-empresas', loadChildren: () => import('./component/grupo-empresas/grupo-empresas.module').then(m => m.GrupoEmpresasModule) },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
