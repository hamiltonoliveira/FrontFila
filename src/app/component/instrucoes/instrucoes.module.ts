import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  

import { InstrucoesRoutingModule } from './instrucoes-routing.module';
import { InstrucoesComponent } from './instrucoes.component';


@NgModule({
  declarations: [
    InstrucoesComponent
  ],
  imports: [
    CommonModule,
    InstrucoesRoutingModule,
    FormsModule
  ]
})
export class InstrucoesModule { }
