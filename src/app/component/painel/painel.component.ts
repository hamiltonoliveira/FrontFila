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
}
