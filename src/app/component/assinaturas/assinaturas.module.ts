import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssinaturasRoutingModule } from './assinaturas-routing.module';
import { AssinaturasComponent } from './assinaturas.component';
import { AssinaturaEletronicaComponent } from './../../assinatura-eletronica/assinatura-eletronica.component';


@NgModule({
  declarations: [
    AssinaturasComponent,
    AssinaturaEletronicaComponent
  ],
  imports: [
    CommonModule,
    AssinaturasRoutingModule
  ]
})
export class AssinaturasModule { }
