import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChamadoRoutingModule } from './chamado-routing.module';
import { ChamadoComponent } from './chamado.component';


@NgModule({
  declarations: [
    ChamadoComponent
  ],
  imports: [
    CommonModule,
    ChamadoRoutingModule
  ]
})
export class ChamadoModule { }
