// configuracao-documento.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/app/local-storage.service';
import { ConfiguracaoDocumentoService } from 'src/services/configuracao-documento.service';

@Component({
  selector: 'app-configuracao-documento',
  templateUrl: './configuracao-documento.component.html'
})
export class ConfiguracaoDocumentoComponent implements OnInit {
  formulario!: FormGroup;
  dataHoje: string = '';
  caracteresDigitados: number = 0;

  constructor(private fb: FormBuilder,
    private configuracaoDocumentoService: ConfiguracaoDocumentoService,
    private localStorageService: LocalStorageService) { }

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

    console.log(payload)

    this.configuracaoDocumentoService.criarFila(guidCliente, payload).subscribe({
      next: (res) => {
        console.log('Fila criada com sucesso:', res);
      },
      error: (err) => {
        console.error('Erro ao criar fila:', err);
      }
    });
  }


  onSubmit() {
    if (this.formulario.valid) {
      this.criarFila();
      //console.log('Dados enviados:', this.formulario.value);
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
