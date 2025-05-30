import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegracaoComponent } from './integracao.component';

const routes: Routes = [{ path: '', component: IntegracaoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegracaoRoutingModule { }
