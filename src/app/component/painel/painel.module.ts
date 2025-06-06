import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PainelRoutingModule } from './painel-routing.module';
import { PainelComponent } from './painel.component';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PainelComponent
  ],
  imports: [
    CommonModule,
    PainelRoutingModule,
    FormsModule
  ]
})
export class PainelModule { }
