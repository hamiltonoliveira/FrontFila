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

  constructor(private painelService: PainelService) { 
   this. carregaDocumentos();
  }

  calcularPreco(bytes: number): string {
  const precoPorMB = 25.00
  const mb = bytes / (1024 * 1024);
  let preco = mb * precoPorMB;
  preco = Math.max(preco, 0.01);
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

  carregaDocumentos(): void {
      const guidCliente = localStorage.getItem('guidCliente');
      if (!guidCliente) return;
      //this.spinner(true);
      this.painelService.listarMGS(guidCliente).subscribe({
        next: (dados: DocumentoMSG[]) => {
          this.Documentacao = dados ?? [];
          if (!dados || dados.length === 0) {
            //this.toastr.warning('Atenção: esta fila ainda não possui configuração de documentos.');
          }
          //this.spinner(false);
        },
        error: (erro) => {
          //this.Erro('Erro ao carregar configurações de documento:');
          //this.spinner(false);
        }
      });
    }
  


}
