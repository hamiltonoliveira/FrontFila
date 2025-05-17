import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracaoDocumentoComponent } from './configuracao-documento.component';

const routes: Routes = [{ path: '', component: ConfiguracaoDocumentoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracaoDocumentoRoutingModule { }
