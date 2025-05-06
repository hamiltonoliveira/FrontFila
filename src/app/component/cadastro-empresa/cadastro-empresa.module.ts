import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadastroEmpresaRoutingModule } from './cadastro-empresa-routing.module';
import { CadastroEmpresaComponent } from './cadastro-empresa.component';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    CadastroEmpresaComponent
  ],
  imports: [
    CommonModule,
    CadastroEmpresaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
})
export class CadastroEmpresaModule { }
