import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import planosJson from './../../assets/plano.json'
import { ToastrService } from 'ngx-toastr';
import { AssinaturaEletronicaService } from 'src/services/assinatura-eletronica.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TipoServico } from '../models/tipo-servico.enum';
import { ContratoService } from 'src/services/contrato.service';


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

  htmlConteudo: string = '';
  Documentacao: any[] = [];

  constructor(private http: HttpClient,
    private assinaturaEletronicaService: AssinaturaEletronicaService,
    private contratoService:ContratoService,
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
     
      this.criarAssinatura();
      this.criarContrato();
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

  criarContrato(): void {
    const guidCliente = localStorage.getItem("guidCliente");
    const payload = {
      PlanoId: this.planoEscolhido,
      GuidCliente: guidCliente 
    };
    this.contratoService.criarContrato(payload).subscribe(
      dados => {
        this.toastr.success('Contrato arquivada.');
      },
      erro => {
        this.toastr.error("Contrato nã0 existe.");
      }
    );
  }

  contrato(): void {
    this.imprimeContratoGuid();
  }

  formatarCnpj(cnpj: string): string {
    if (!cnpj) return '';
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    let recebe = cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    return recebe;
  }

  formatarData(dataString: string): string {
    const data = new Date(dataString);

    if (isNaN(data.getTime())) {
      throw new Error('Data inválida');
    }

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

 nomePlanoServico(planoId: string | number): string {
  const id = Number(planoId);

  switch (id) {
    case TipoServico.Básico:
      return 'Plano Básico';
    case TipoServico.Intermediário:
      return 'Plano Intermediário';
    case TipoServico.Premium:
      return 'Plano Premium';
    default:
      return 'Plano Desconhecido';
  }
}


  carregarHtml(documento: any) {
    this.http.get('assets/html/contrato.html', { responseType: 'text' })
      .subscribe({
        next: (html) => {
          const monstarHTML = documento;

          let cnpjFormatado = this.formatarCnpj(monstarHTML.cnpjContratante);
          let cadastro = this.formatarData(monstarHTML.dataCadastro);
          let nomePlano = this.nomePlanoServico(monstarHTML.plano);

          this.htmlConteudo = html.replace('$cnpjContratante', cnpjFormatado)
                                  .replace('$razaoSocial', monstarHTML.razaoSocial)
                                  .replace('$valorContrato' , monstarHTML.valorMensal)
                                  .replace('$plano' , nomePlano)
                                  .replace('$assinatura', monstarHTML.hashDocumento)
                                  .replace('$dataCadastro', cadastro)
                                  .replace(/contenteditable="true"/g, 'contenteditable="false"');


        },
        error: () => {
          this.toastr.error('Erro ao carregar conteúdo HTML.');
        }
      });
  }

gerarEImprimirPDF() {
  const elemento = document.getElementById('conteudo-para-pdf');

  if (!elemento) {
    this.toastr.error('Conteúdo para PDF não encontrado.');
    return;
  }

  html2canvas(elemento).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10; // margem em mm

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - margin * 2;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let finalPdfHeight = pdfHeight;
    if (pdfHeight > (pageHeight - margin * 2)) {
      finalPdfHeight = pageHeight - margin * 2;
      const finalPdfWidth = (imgProps.width * finalPdfHeight) / imgProps.height;
      pdf.addImage(imgData, 'PNG', margin, margin, finalPdfWidth, finalPdfHeight);
    } else {
      pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);
    }
    
    pdf.autoPrint();
    window.open(pdf.output('bloburl'), '_blank');
  });
}


  carregaContratoGuid(): void {
    const guidCliente = localStorage.getItem("guidCliente") as string;
    this.assinaturaEletronicaService.listarContratoGuid(guidCliente).subscribe({
      next: (dados: any) => {
        this.Documentacao = dados ?? [];
        this.carregarHtml(this.Documentacao);
        if (!dados || dados.length === 0) {
          this.toastr.warning('Atenção: esta fila ainda não possui configuração de documentos.');
        }
        //this.spinner(false);
      },
      // error: (erro) => {
      // this.Erro('Erro ao carregar configurações de documento:');
      // this.spinner(false);
      // }
    });
  }

  imprimeContratoGuid(): void {
    const guidCliente = localStorage.getItem("guidCliente") as string;
    this.assinaturaEletronicaService.imprimeContratoGuid(guidCliente).subscribe({
      next: (dados: any) => {
        this.Documentacao = dados ?? [];
        this.carregarHtml(this.Documentacao);

        console.log(this.Documentacao)


        if (!dados || dados.length === 0) {
          this.toastr.warning('Atenção: esta fila ainda não possui configuração de documentos.');
        }
        //this.spinner(false);
      },
      // error: (erro) => {
      // this.Erro('Erro ao carregar configurações de documento:');
      // this.spinner(false);
      // }
    });
  }


}

