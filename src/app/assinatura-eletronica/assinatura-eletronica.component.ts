import { Component, ElementRef, ViewChild } from '@angular/core';
import { LocalStorageService } from './../local-storage.service';

@Component({
  selector: 'app-assinatura-eletronica',
  templateUrl: './assinatura-eletronica.component.html',
  styleUrls: ['./assinatura-eletronica.component.css']
})
export class AssinaturaEletronicaComponent {
  @ViewChild('assinaturaCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private desenhando = false;
  imagemAssinatura: string | null = null;
  codigoAssinatura: string | null = null;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.codigoNumeracao();
  }

  codigoNumeracao(): void {
    const prefixo = 'AE'; // Assinatura Eletrônica
    const data = new Date();
    const timestamp = data.getTime(); // milissegundos desde 1970
    const random = Math.floor(1000 + Math.random() * 9000); // 4 dígitos aleatórios
    this.codigoAssinatura = `${prefixo}-${timestamp}-${random}`;
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 500;
    canvas.height = 150;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.font = '14px Montserrat, sans-serif';
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

  salvar(): void {
    const canvas = this.canvasRef.nativeElement;
    this.imagemAssinatura = canvas.toDataURL('image/png');
    console.table(this.imagemAssinatura);
  }
}
