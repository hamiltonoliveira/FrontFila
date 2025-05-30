import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegracaoRoutingModule } from './integracao-routing.module';
import { IntegracaoComponent } from './integracao.component';


@NgModule({
  declarations: [
    IntegracaoComponent
  ],
  imports: [
    CommonModule,
    IntegracaoRoutingModule
  ]
})
export class IntegracaoModule { }
