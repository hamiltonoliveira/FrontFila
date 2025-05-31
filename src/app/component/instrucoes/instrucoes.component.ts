import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfiguracaoDocumentoMQDTO } from 'src/app/models/ConfiguracaoDocumentoMQ.Model';
import { ToastrService } from 'ngx-toastr';
import { PublicarService } from 'src/services/publicar.service';
import { ConfiguracaoDocumentoService } from 'src/services/configuracao-documento.service';

import { TipoArquivo } from './../../models/tipo-arquivo.enum';


@Component({
  selector: 'app-instrucoes',
  templateUrl: './instrucoes.component.html',
  styleUrls: ['./instrucoes.component.css']
})
export class InstrucoesComponent implements OnInit {
  //filas: string[] = [];
  filaSelecionada = [];
  conteudoMensagem = '';
  ConfiguracaoDocumento: ConfiguracaoDocumentoMQDTO[] = [];
  carregando = true;
  tipoArquivo = 0;
  tipoMensagem = '';
  guid = '';

  constructor(private http: HttpClient,
    private configuracaoDocumentoService: ConfiguracaoDocumentoService,
    private publicarService: PublicarService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.carregaDocumentos();
  }

  verificarTipo(valor: number) {
    const tipo = TipoArquivo[valor];
    this.tipoMensagem = `O objeto será enviado para a fila no formato: ${tipo}.`;
  }


  spinner(valor: boolean) {
    this.carregando = valor;
  }

  onSelecionarTipo(tipo: any): void {
    const tipoObj = typeof tipo === 'string' ? JSON.parse(tipo) : tipo;
    this.verificarTipo(Number(JSON.stringify(tipoObj.tipoArquivo)));
    this.guid = JSON.stringify(tipoObj.guid);
    this.tipoArquivo = Number(JSON.stringify(tipoObj.tipoArquivo));
  }

  enviarMensagem(): void {
    if (!this.filaSelecionada || !this.conteudoMensagem) {
      this.toastr.warning('Por favor, selecione uma fila e insira a mensagem.');
      return;
    }

    const payload = {
      fila: Number(this.filaSelecionada),
      mensagem: this.conteudoMensagem,
    };


    this.publicarService.Publicar(payload.mensagem, this.guid, this.tipoArquivo).subscribe({
      next: (res) => {
        this.toastr.success(`O arquivo ${this.tipoArquivo === 1 ? 'JSON' : 'XML'} (ID: ${payload.fila}) foi publicado com sucesso.`
        );
      },
      error: (err) => {
        this.toastr.error('Erro ao enviar para a fila');
      }
    });
  }

  carregaDocumentos(): void {
    const guidCliente = localStorage.getItem('guidCliente');
    if (!guidCliente) return;
    this.configuracaoDocumentoService.listarConfiguracao(guidCliente).subscribe({
      next: (dados: ConfiguracaoDocumentoMQDTO[]) => {
        if (dados) {
          this.toastr.success('Carregado apenas filas ativas.');
        }
        this.ConfiguracaoDocumento = dados ?? [];

        if (!dados || dados.length === 0) {
          this.toastr.warning('Nenhuma configuração de documento encontrada.');
        }
        this.spinner(false);
      },
      error: (erro) => {
        this.toastr.error('Erro ao carregar configurações de documento.');
        this.spinner(false);
      }
    });
  }
}
