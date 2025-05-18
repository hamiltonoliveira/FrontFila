// configuracao-documento.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-configuracao-documento',
  templateUrl: './configuracao-documento.component.html'
})
export class ConfiguracaoDocumentoComponent implements OnInit {
  formulario!: FormGroup;
  dataHoje: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      tipoServico: ['', Validators.required],
      tipoArquivo: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFinal: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.minLength(10)]]
    }, { validators: this.dataValida });
    this.setarDataAtual();
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

  onSubmit() {
    if (this.formulario.valid) {
      console.log('Dados enviados:', this.formulario.value);
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
