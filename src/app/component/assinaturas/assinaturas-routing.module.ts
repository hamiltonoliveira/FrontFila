import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssinaturasComponent } from './assinaturas.component';
import { AssinaturaEletronicaComponent } from 'src/app/assinatura-eletronica/assinatura-eletronica.component';

const routes: Routes = [
  { path: '', component: AssinaturasComponent },
  { path: '', component: AssinaturaEletronicaComponent }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssinaturasRoutingModule { }
