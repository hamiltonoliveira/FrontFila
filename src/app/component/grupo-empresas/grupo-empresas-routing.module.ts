import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrupoEmpresasComponent } from './grupo-empresas.component';

const routes: Routes = [{ path: '', component: GrupoEmpresasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoEmpresasRoutingModule { }
