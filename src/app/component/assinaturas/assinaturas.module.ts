import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssinaturasRoutingModule } from './assinaturas-routing.module';
import { AssinaturasComponent } from './assinaturas.component';


@NgModule({
  declarations: [
    AssinaturasComponent
  ],
  imports: [
    CommonModule,
    AssinaturasRoutingModule
  ]
})
export class AssinaturasModule { }
