// configuracao-documento.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/local-storage.service';
import { ConfiguracaoDocumentoService } from 'src/services/configuracao-documento.service';
import { ConfiguracaoDocumentoMQDTO } from 'src/app/models/ConfiguracaoDocumentoMQ.Model';

import { TipoServico } from '../../models/tipo-servico.enum';
import { TipoArquivo } from 'src/app/models/tipo-arquivo.enum';

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

  tiposServico: { chave: string; valor: number }[] = [];
  tiposArquivo: { chave: string; valor: number }[] = [];
 
 
  constructor(private fb: FormBuilder,
    private configuracaoDocumentoService: ConfiguracaoDocumentoService,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService) { }

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
    this.carregaDocumentos();
    this.ServicoEnum();
    this.ServicoArquivioEnum();
  }

  ServicoEnum(){
     this.tiposServico = Object.keys(TipoServico)
      .filter(key => isNaN(Number(key))) // só as chaves (nomes)
      .map(key => ({
        chave: key,
        valor: TipoServico[key as keyof typeof TipoServico]
      }));
  }

   ServicoArquivioEnum(){
     this.tiposArquivo = Object.keys(TipoArquivo)
      .filter(key => isNaN(Number(key))) // só as chaves (nomes)
      .map(key => ({
        chave: key,
        valor: TipoArquivo[key as keyof typeof TipoArquivo]
      }));
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

  alternarStatus(id: number) {
    console.log(id)
    this.configuracaoDocumentoService.Status(id).subscribe({
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

    const guidCliente = this.localStorageService.getItem("guidCliente") as string;
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

  carregaDocumentos(): void {
    const guidCliente = localStorage.getItem('guidCliente');
    if (guidCliente) {
      this.configuracaoDocumentoService.listarConfiguracao(guidCliente).subscribe({
        next: (dados: ConfiguracaoDocumentoMQDTO[]) => {
          this.ConfiguracaoDocumento = dados;
        }
      });
    }
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
