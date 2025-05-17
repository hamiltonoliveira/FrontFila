// configuracao-documento.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-configuracao-documento',
  templateUrl: './configuracao-documento.component.html'
})
export class ConfiguracaoDocumentoComponent implements OnInit {
  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      tipoServico: ['', Validators.required],
      tipoArquivo: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFinal: ['', Validators.required]
    }, { validators: this.dataValida });
  }
 
  dataValida(form: FormGroup) {
    const inicio = new Date(form.get('dataInicio')?.value);
    const fim = new Date(form.get('dataFinal')?.value);

    return fim >= inicio ? null : { dataInvalida: true };
  }

  onSubmit() {
    if (this.formulario.valid) {
      console.log('Dados enviados:', this.formulario.value);
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
