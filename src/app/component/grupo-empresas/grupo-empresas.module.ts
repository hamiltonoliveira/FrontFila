import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoEmpresasRoutingModule } from './grupo-empresas-routing.module';
import { GrupoEmpresasComponent } from './grupo-empresas.component';


@NgModule({
  declarations: [
    GrupoEmpresasComponent
  ],
  imports: [
    CommonModule,
    GrupoEmpresasRoutingModule
  ]
})
export class GrupoEmpresasModule { }
