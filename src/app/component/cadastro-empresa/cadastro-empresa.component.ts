import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuscepService } from '../../../services/buscep.service';

@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.css']
})
export class CadastroEmpresaComponent implements OnInit {
  empresaForm!: FormGroup;
  cnpjInvalido = false;

  constructor(
    private fb: FormBuilder,
    private buscepService: BuscepService
  ) {}

  ngOnInit() {
    this.empresaForm = this.fb.group({
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      cnpj: ['', [Validators.required]],
      contato: [''],
      email: ['', [Validators.email]],
      telefone: [''],
      endereco: [''],
      cidade: [''],
      estado: [''],
      cep: [''],
      senha: ['', Validators.required],
      confirmasenha: ['', Validators.required]
    });
  }

  buscarEnderecoPorCep(): void {
    const cep = this.empresaForm.get('cep')?.value?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      this.buscepService.buscarPorCep(cep).subscribe(
        dados => {
          if (!dados.erro) {
            this.empresaForm.patchValue({
              endereco: `${dados.logradouro}, ${dados.bairro}`,
              cidade: dados.localidade,
              estado: dados.uf
            });
          } else {
            alert('CEP não encontrado.');
          }
        },
        error => {
          console.error('Erro ao buscar CEP:', error);
          alert('Erro ao buscar o CEP.');
        }
      );
    } else {
      alert('CEP inválido. Deve conter 8 dígitos.');
    }
  }

  verificarCnpj(): void {
    const cnpj = this.empresaForm.get('cnpj')?.value?.replace(/[^\d]+/g, '') || '';
    this.cnpjInvalido = !this.validarCNPJ(cnpj);
  }

  validarCNPJ(cnpj: string): boolean {
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += +numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== +digitos.charAt(0)) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += +numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === +digitos.charAt(1);
  }

  onSubmit(){

  }
}
