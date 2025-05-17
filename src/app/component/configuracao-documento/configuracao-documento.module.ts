import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracaoDocumentoRoutingModule } from './configuracao-documento-routing.module';
import { ConfiguracaoDocumentoComponent } from './configuracao-documento.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    ConfiguracaoDocumentoComponent
  ],
  imports: [
    CommonModule,
    ConfiguracaoDocumentoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
   providers: [provideNgxMask()],
})
export class ConfiguracaoDocumentoModule { }
