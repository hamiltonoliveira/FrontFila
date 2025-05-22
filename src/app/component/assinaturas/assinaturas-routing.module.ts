import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssinaturasComponent } from './assinaturas.component';

const routes: Routes = [{ path: '', component: AssinaturasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssinaturasRoutingModule { }
