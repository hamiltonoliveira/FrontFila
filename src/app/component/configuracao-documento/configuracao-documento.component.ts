import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/local-storage.service';
import { ConfiguracaoDocumentoService } from 'src/services/configuracao-documento.service';
import { ConfiguracaoDocumentoMQDTO } from 'src/app/models/ConfiguracaoDocumentoMQ.Model';

import { HttpClient } from '@angular/common/http';

import { TipoServico } from '../../models/tipo-servico.enum';
import { TipoArquivo } from 'src/app/models/tipo-arquivo.enum';
import { AssinaturaEletronicaService } from 'src/services/assinatura-eletronica.service';
import { Assinatura } from 'src/app/models/assinatura-eletronica.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-configuracao-documento',
  templateUrl: './configuracao-documento.component.html'
})

export class ConfiguracaoDocumentoComponent implements OnInit {
  formulario!: FormGroup;
  dataHoje: string = '';
  caracteresDigitados: number = 0;
  statusAtivo: string = 'ON';
  ConfiguracaoDocumento: ConfiguracaoDocumentoMQDTO[] = [];
  Documentacao: ConfiguracaoDocumentoMQDTO[] = [];
  Assisnatura: Assinatura[] = [];

  tiposArquivo: { chave: string; valor: number }[] = [];
  carregando = false;
  htmlConteudo: string = '';


  constructor(private fb: FormBuilder,
    private configuracaoDocumentoService: ConfiguracaoDocumentoService,
    private assinaturaEletronicaService: AssinaturaEletronicaService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient) {
    this.carregaContratoGuid()
  }

  ngOnInit() {
    this.formulario = this.fb.group({
      ativo: [true],
      tipoServico: [null, Validators.required],
      tipoArquivo: [null, Validators.required],
      dataInicio: ['', Validators.required],
      dataFinal: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.minLength(10)]]
    }, { validators: this.dataValida });

    this.setarDataAtual();
    this.formulario.get('descricao')?.valueChanges.subscribe(valor => {
      this.caracteresDigitados = valor?.length || 0;
    });
    this.spinner(true);
    this.ServicoArquivioEnum();
    this.carregaDocumentos();
  }

  carregarHtml(documento: any) {
    this.http.get('assets/html/modelo-integracao.html', { responseType: 'text' })
      .subscribe({
        next: (html) => {
          const monstarHTML = documento;
          const datainicio = this.formatarData(monstarHTML.dataInicio);
          const datafinal = this.formatarData(monstarHTML.dataFinal);

          this.htmlConteudo = html.replace('$descricao', monstarHTML.descricao)
            .replace('$chave', monstarHTML.guid)
            .replace('$dataInicio', datainicio)
            .replace('$dataFinal', datafinal);
        },
        error: () => {
          this.toastr.error('Erro ao carregar conteúdo HTML.');
        }
      });
  }

  baixarArquivo(guid: string) {
    this.carregaDocumentosGuid(guid);
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

  ServicoArquivioEnum() {
    this.tiposArquivo = Object.keys(TipoArquivo)
      .filter(key => isNaN(Number(key))) // só as chaves (nomes)
      .map(key => ({
        chave: key,
        valor: TipoArquivo[key as keyof typeof TipoArquivo]
      }));
  }

  spinner(valor: boolean) {
    this.carregando = valor;
  }

  mudarStatus() {
    const valor = this.formulario.get('ativo')?.value;
    this.statusAtivo = valor ? 'ON' : 'OFF';
  }

  atualizarContador() {
    const valor = this.formulario.get('descricao')?.value || '';
    this.caracteresDigitados = valor.length;
  }

  dataValida(form: FormGroup) {
    const inicio = new Date(form.get('dataInicio')?.value);
    const fim = new Date(form.get('dataFinal')?.value);

    return fim >= inicio ? null : { dataInvalida: true };
  }

  setarDataAtual(): void {
    const hoje = new Date();
    this.dataHoje = hoje.toISOString().split('T')[0]; // usado no atributo [min]
    this.formulario.patchValue({
      dataInicio: this.dataHoje,
      dataFinal: this.dataHoje
    });
  }

  alternarStatus(guid: string) {
    console.log(guid)
    this.configuracaoDocumentoService.Status(guid).subscribe({
      next: (res) => {
        this.Sucesso('Status alterado da Fila');
        this.carregaDocumentos();
      },
      error: (err) => {
        this.Erro('Erro ao alterar o status da Fila');
      }
    });
  }

  criarFila(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const guidCliente = localStorage.getItem("guidCliente") as string;
    const dados = this.formulario.value;
    const payload = {
      ...dados,
      dataInicio: new Date(dados.dataInicio).toISOString(),
      dataFinal: new Date(dados.dataFinal).toISOString(),
      tipoServico: Number(this.formulario.value.tipoServico),
      tipoArquivo: Number(this.formulario.value.tipoArquivo)
    };

    this.configuracaoDocumentoService.criarFila(guidCliente, payload).subscribe({
      next: (res) => {
        this.Sucesso('Fila criada com sucesso');
        this.carregaDocumentos();
      },
      error: (err) => {
        this.Erro('Erro ao criar fila');
      }
    });
  }

  carregaContratoGuid(): void {
    const guidCliente = localStorage.getItem('guidCliente');
    if (!guidCliente) return;
    this.spinner(true);
    this.assinaturaEletronicaService.listarContratoGuid(guidCliente).subscribe({
      next: (dados: Assinatura[]) => {
        this.Assisnatura = dados ?? [];
        
        if (!dados || dados.length === 0) {
          this.toastr.warning('Atenção: não há contratos disponíveis. Verifique se a fila está cadastrada.');
          this.router.navigate(['/contrato']);
        }
        this.spinner(false);
      },
      error: (erro) => {
        this.Erro('Erro ao carregar contrato:');
        this.spinner(false);
      }
    });
  }

  carregaDocumentos(): void {
    const guidCliente = localStorage.getItem('guidCliente');
    if (!guidCliente) return;
    this.spinner(true);
    this.configuracaoDocumentoService.listarConfiguracao(guidCliente).subscribe({
      next: (dados: ConfiguracaoDocumentoMQDTO[]) => {
        this.ConfiguracaoDocumento = dados ?? [];
        if (!dados || dados.length === 0) {
          this.toastr.warning('Atenção: esta fila ainda não possui configuração de documentos.');
        }
        this.spinner(false);
      },
      error: (erro) => {
        this.Erro('Erro ao carregar configurações de documento:');
        this.spinner(false);
      }
    });
  }

  carregaDocumentosGuid(guid: string): void {
    this.configuracaoDocumentoService.listarConfiguracaoGuid(guid).subscribe({
      next: (dados: ConfiguracaoDocumentoMQDTO[]) => {
        this.Documentacao = dados ?? [];
        this.carregarHtml(this.Documentacao);
        if (!dados || dados.length === 0) {
          this.toastr.warning('Atenção: esta fila ainda não possui configuração de documentos.');
        }
        this.spinner(false);
      },
      error: (erro) => {
        this.Erro('Erro ao carregar configurações de documento:');
        this.spinner(false);
      }
    });
  }

  getTipoArquivoDescricao(valor: number): string {
    return TipoArquivo[valor];
  }

  getTipoServicoDescricao(valor: number): string {
    return TipoServico[valor];
  }

  Sucesso(msg?: string) {
    this.toastr.success(msg, 'Sucesso!', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  Erro(msg?: string) {
    this.toastr.error(msg, 'Erro!', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.criarFila();
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
