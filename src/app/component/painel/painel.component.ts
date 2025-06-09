import { Component } from '@angular/core';
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
  carregando = false;

  filtroStatus: string = '';
  filtroFila: string = '';
  filtroData: string = '';
  filtroDescricao: string = '';
  filtroTipo: string = '';
  filtroRegistros?: number;

  constructor(private painelService: PainelService) {
    this.carregaDocumentos();
  }

  spinner(valor: boolean) {
    this.carregando = valor;
  }

  abrirCalculadora(valor: any): void {
    console.log('Abrindo calculadora para:', valor);
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
    if (dias > 0 && dias <= 5) return 'bg-atencao-soft';
    if (dias > 5) return 'bg-tomato-soft';
    return 'bg-danger-subtle text-dark';
  }
}
