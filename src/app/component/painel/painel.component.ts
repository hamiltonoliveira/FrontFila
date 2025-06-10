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
    console.log('Abrindo calculadora para:', valor);
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


          const dias = Number(this.diasAtraso(this.dataEnvio));
          this.valorExcedente = (dias > 10)
            ? ((dias - 10) * 0.50).toString()
            : '0';
 

         this.equacao = "Dias em atraso > 10 então (dias -10) * 0,50";

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

  getCorLinha(dataEnvio: Date, pendente: string): string {
    if (pendente !== 'Pendente') {
      return ''; // ou uma classe neutra, como 'bg-body' ou 'bg-white'
    }

    const hoje = new Date();
    const envio = new Date(dataEnvio);
    envio.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    const diffEmMs = hoje.getTime() - envio.getTime();
    const dias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

    if (dias === 0) return 'bg-norma-soft';
    if (dias >= 1 && dias < 10) return 'bg-atencao-soft';
    if (dias >= 10) return 'bg-tomato-soft';
    return 'bg-danger-subtle text-dark';
  }


  diasAtraso(dataEnvio: Date): number {
    const hoje = new Date();
    const envio = new Date(dataEnvio);

    // Normaliza as datas para ignorar horas, minutos, segundos e milissegundos
    envio.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    const diffEmMs = hoje.getTime() - envio.getTime();
    const dias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

    return dias > 0 ? dias : 0;
  }

}
