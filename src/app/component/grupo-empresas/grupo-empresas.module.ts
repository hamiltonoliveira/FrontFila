import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoEmpresasRoutingModule } from './grupo-empresas-routing.module';
import { GrupoEmpresasComponent } from './grupo-empresas.component';

import { CepMaskPipe } from '../../pipes/cep-mask.pipe';
import { CnpjMaskPipe } from '../../pipes/cnpj-mask.pipe';
import { TelefoneMaskPipe } from '../../pipes/telefone-mask.pipe';

@NgModule({
  declarations: [
    GrupoEmpresasComponent,
    CepMaskPipe,
    CnpjMaskPipe,
    TelefoneMaskPipe
  ],
  imports: [
    CommonModule,
    GrupoEmpresasRoutingModule
  ]
})
export class GrupoEmpresasModule { }
