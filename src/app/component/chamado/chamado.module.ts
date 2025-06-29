import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChamadoRoutingModule } from './chamado-routing.module';
import { ChamadoComponent } from './chamado.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChamadoComponent
  ],
  imports: [
    CommonModule,
    ChamadoRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChamadoModule { }
