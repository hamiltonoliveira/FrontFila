import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';  
import { FormsModule } from '@angular/forms';  
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { AppRoutingModule } from './app-routing.module';
import { RodapeComponent } from './rodape/rodape.component';
import { ContratoComponent } from './contrato/contrato.component';

 
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RodapeComponent,
    ContratoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,  
    ToastrModule.forRoot()
  ],
  providers: [
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
