import { Component } from '@angular/core';
import { Observable, Subscribable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})


export class MenuComponent {
  logado = false;


  constructor() {
    const token = localStorage.getItem('token');
    this.logado = !!token; 
  }
}


