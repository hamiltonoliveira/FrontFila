import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadastroEmpresaRoutingModule } from './cadastro-empresa-routing.module';
import { CadastroEmpresaComponent } from './cadastro-empresa.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CadastroEmpresaComponent
  ],
  imports: [
    CommonModule,
    CadastroEmpresaRoutingModule,
    FormsModule
  ]
})
export class CadastroEmpresaModule { }
