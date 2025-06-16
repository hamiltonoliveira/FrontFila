import { Component } from '@angular/core';
import { Calculadora } from 'src/app/models/calculadora.model';
import { DocumentoMSG } from 'src/app/models/documentoMsg';
import { PainelService } from 'src/services/painel.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent {

  Documentacao: DocumentoMSG[] = [];
  documentacaoOriginal: DocumentoMSG[] = [];
  calculadora: Calculadora[] = [];
  carregando = false;

  filtroStatus: string = '';
  filtroFila: string = '';
  filtroData: string = '';
  filtroDescricao: string = '';
  filtroTipo: string = '';
  filtroRegistros?: number;

  dataEnvio!: Date;
  ativo: boolean = true;
  diasRetencao: string = '';
  limiteRegistrosMensal: string = '';
  nomeFila: string = '';
  registros: string = '';
  status: string = '';
  valorMensal: string = '';
  valorPorRegistroExcedente: string = '';
  valorRetencaoExtraPorDia: string = '';
  hoje: Date | undefined;
  valorExcedente: string = '';
  equacao: string = '';


  constructor(private painelService: PainelService) {
    this.carregaDocumentos();
  }

  ngOnInit() {
    this.hoje = new Date();
  }

  spinner(valor: boolean) {
    this.carregando = valor;
  }

  abrirCalculadora(valor: any): void {
    this.carregaCalculadora(valor);
  }

  carregaCalculadora(guid: string): void {
    this.painelService.CalculadoraGuid(guid).subscribe({
      next: (dados: Calculadora[]) => {
        this.calculadora = dados ?? [];
        if (this.calculadora.length > 0) {
          const calculo = this.calculadora[0];

          this.dataEnvio = calculo.dataEnvio ?? '';
          this.diasRetencao = calculo.diasRetencao?.toString() ?? '';
          this.limiteRegistrosMensal = calculo.limiteRegistrosMensal?.toString() ?? '';
          this.nomeFila = calculo.nomeFila ?? '';
          this.registros = calculo.registros?.toString() ?? '';
          this.status = calculo.status ?? '';
          this.valorMensal = calculo.valorMensal?.toString() ?? '';
          this.valorPorRegistroExcedente = calculo.valorPorRegistroExcedente?.toString() ?? '';
          this.valorRetencaoExtraPorDia = calculo.valorRetencaoExtraPorDia?.toString() ?? '';
          this.ativo = calculo.ativo;

          const dias = Number(this.diasAtraso(this.dataEnvio, this.ativo));

           this.valorExcedente='';

          if (dias > 10) {
            this.valorExcedente = ((dias - Number(this.diasRetencao)) * Number(this.valorRetencaoExtraPorDia)).toString();
          }
          else{
            this.valorExcedente= '0';
          }

          this.equacao = `Atrasos superiores a ${this.diasRetencao}, aplica-se a fórmula: (Dia(s) em atraso - ${this.diasRetencao}) × ${this.valorRetencaoExtraPorDia}`;
        }
      },
      error: () => {
        this.spinner(false);
      }
    });
  }

  carregaDocumentos(): void {
    const guidCliente = localStorage.getItem('guidCliente');
    if (!guidCliente) return;
    this.spinner(true);
    this.painelService.listarMGS(guidCliente).subscribe({
      next: (dados: DocumentoMSG[]) => {
        this.documentacaoOriginal = dados ?? [];
        this.Documentacao = [...this.documentacaoOriginal];
        this.spinner(false);
      },
      error: () => {
        this.spinner(false);
      }
    });
  }


  getDocumentacaoFiltrada(): DocumentoMSG[] {
    const includesIgnoreCase = (value: any, filter?: string) => {
      if (!filter) return true;
      if (value == null) return false;
      return value.toString().toLowerCase().includes(filter.toLowerCase());
    };

    return this.documentacaoOriginal.filter(item => {
      const dataEnvioStr = item.dataEnvio ? item.dataEnvio.toString() : '';
      const dataEnvioMatch = !this.filtroData || dataEnvioStr.toLowerCase().includes(this.filtroData.toLowerCase());

      return (
        includesIgnoreCase(item.status, this.filtroStatus) &&
        includesIgnoreCase(item.queueName, this.filtroFila) &&
        dataEnvioMatch &&
        includesIgnoreCase(item.descricao, this.filtroDescricao) &&
        includesIgnoreCase(item.tipoArquivo, this.filtroTipo) &&
        (!this.filtroRegistros || item.registros === this.filtroRegistros)
      );
    });
  }

  getCorLinha(dataEnvio: Date, status: string): string {
    if (status !== 'Pendente' && status !== 'Atrasado') {
      return '';
    }
    const hoje = new Date();
    const envio = new Date(dataEnvio);

    envio.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    const dias = Math.floor((hoje.getTime() - envio.getTime()) / (1000 * 60 * 60 * 24));

    if (dias === 0) return 'bg-norma-soft';
    if (dias >= 1 && dias < 10) return 'bg-atencao-soft';
    if (dias > 10) return 'bg-atrasado-soft';

    return 'bg-danger-subtle text-dark'; // Fallback
  }


  diasAtraso(dataEnvio: Date, ativo: boolean): number {
    if (ativo == true) {
      const hoje = new Date();
      const envio = new Date(dataEnvio);

      envio.setHours(0, 0, 0, 0);
      hoje.setHours(0, 0, 0, 0);

      const diffEmMs = hoje.getTime() - envio.getTime();
      const dias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

      return dias > 0 ? dias : 0;
    }
    else {
      return 0;
    }
  }
}
