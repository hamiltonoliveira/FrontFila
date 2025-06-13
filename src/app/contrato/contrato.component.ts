import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import planosJson from './../../assets/plano.json'
 

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit {

  @ViewChild('assinaturaCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  
  planos: any[] = [];
  aberturaContratual!:number;
  precoPlano!: number;

  imagemAssinatura: string | null = null;
  codigoAssinatura: string | null = null;
  private desenhando = false;

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

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 500;
    canvas.height = 150;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.font = '12px Montserrat, sans-serif';
    this.ctx.fillStyle = '#000';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    const x = (canvas.width / 2) - 160;
    const y = (canvas.height / 2) + 60;
    this.ctx.fillText(this.codigoAssinatura || '', x, y);
  }

  startDrawing(event: MouseEvent): void {
    this.desenhando = true;
    const { offsetX, offsetY } = event;
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX, offsetY);
  }

  draw(event: MouseEvent): void {
    if (!this.desenhando) return;
    const { offsetX, offsetY } = event;
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
  }

  stopDrawing(): void {
    this.desenhando = false;
  }

  limpar(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.imagemAssinatura = null;
    this.ngAfterViewInit();
  }

}
