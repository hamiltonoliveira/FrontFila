import { Component, ElementRef, ViewChild } from '@angular/core';

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

  ngAfterViewInit(): void {
  const canvas = this.canvasRef.nativeElement;

  canvas.width = 500;  // largura do canvas
  canvas.height = 150; // altura do canvas

  this.ctx = canvas.getContext('2d')!;
  this.ctx.strokeStyle = '#000';
  this.ctx.lineWidth = 2;

  // Limpa o canvas antes de desenhar
  this.ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Configura fonte para desenhar texto (use a fonte Montserrat importada no index.html)
  this.ctx.font = '24px Montserrat, sans-serif';
  this.ctx.fillStyle = '#000';  // cor do texto
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';

  // Calcula o centro do canvas
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  // Desenha a frase no centro do canvas
  this.ctx.fillText('Hamilton do Vale Oliveira', x, y);
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
  }

  salvar(): void {
    const canvas = this.canvasRef.nativeElement;
    this.imagemAssinatura = canvas.toDataURL('image/png');
    // Aqui você pode enviar para o backend, salvar localmente etc.
  }
}
