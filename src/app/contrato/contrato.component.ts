import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import planosJson from './../../assets/plano.json'
 

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit {

  planos: any[] = [];
  aberturaContratual!:number;
  precoPlano!: number;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.carregarPlanos(); 
  }

  private carregarPlanos(): void {
    this.planos = planosJson;
  }

  escolherPlano(id:number):void{
    this.aberturaContratual = id;
    if( this.aberturaContratual > 0 ){
      alert(id)
    }
  }
}
