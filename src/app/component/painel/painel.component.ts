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


  carregaDocumentos(): void {
      const guidCliente = localStorage.getItem('guidCliente');
      if (!guidCliente) return;
      //this.spinner(true);
      this.painelService.listarMGS(guidCliente).subscribe({
        next: (dados: DocumentoMSG[]) => {
          this.Documentacao = dados ?? [];

          console.log(this.Documentacao);

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
