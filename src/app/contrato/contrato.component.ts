import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import planosJson from './../../assets/plano.json'
import { ToastrService } from 'ngx-toastr';
import { AssinaturaEletronicaService } from 'src/services/assinatura-eletronica.service';


@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit {

  @ViewChild('assinaturaCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  planos: any[] = [];
  aberturaContratual!: number;
  precoPlano!: number;
  planoEscolhido!: number;

  imagemAssinatura: string | null = null;
  codigoAssinatura: string | null = null;
  private desenhando = false;

  constructor(private http: HttpClient, 
                      private assinaturaEletronicaService: AssinaturaEletronicaService,
                      private toastr: ToastrService) { }

  ngOnInit(): void {
    this.carregarPlanos();
  }

  private carregarPlanos(): void {
    this.planos = planosJson;
  }

  escolherPlano(id: number): void {
    this.aberturaContratual = id;
    if (this.aberturaContratual > 0) {
      this.planoEscolhido = id;
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

  salvar(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let hasDrawing = false;
    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3];
      if (alpha !== 0) {
        hasDrawing = true;
        break;
      }
    }

    const planoValido = Number(this.planoEscolhido) > 0;

    if (hasDrawing && planoValido) {
      this.imagemAssinatura = canvas.toDataURL('image/png');
      console.log(this.imagemAssinatura);
      this.criarAssinatura();
    } else {
      this.toastr.error("Ops! Você precisa escolher um plano, assinar digitalmente e salvar para continuar.");
    }
  }

   criarAssinatura(): void {
    const guidCliente = localStorage.getItem("guidCliente");
    const payload = {
      PlanoId: this.planoEscolhido,
      GuidCliente: guidCliente,
      Assinatura: this.imagemAssinatura
    };
    this.assinaturaEletronicaService.criarFila(payload).subscribe(
      dados => {
        this.toastr.success('Assinatura arquivada.');
      },
      erro => {
        this.toastr.error("Assinatura eletrônica existe.");
      }
    );
  }
 
}

