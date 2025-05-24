import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuscepService } from '../../../services/buscep.service';

import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from 'src/services/empresa.service';

@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.css']
})
export class CadastroEmpresaComponent implements OnInit {
  empresaForm!: FormGroup;
  cnpjInvalido = false;
  carregando = false;

  constructor(
    private fb: FormBuilder,
    private buscepService: BuscepService,
    private empresaService: EmpresaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.empresaForm = this.fb.group(
      {
        razaoSocial: ['', Validators.required],
        nomeFantasia: ['', Validators.required],
        cnpj: ['', [Validators.required]],
        contato: ['', [Validators.required]],
        email: ['', [Validators.email]],
        telefone: ['', [Validators.required]],
        endereco: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        senha: ['', [Validators.required]],
        confirmasenha: ['', [Validators.required]]
      },
      {
        // Validação customizada para comparar as senhas
        validators: this.senhasIguaisValidator
      }
    );
  }

  spinner(valor: boolean) {
    this.carregando = valor;
    if (valor) {
      setTimeout(() => {
        this.carregando = false;
      }, 1000);
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

  ErroCNPJ(msg?: string) {
    this.toastr.error(msg, 'Erro!', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  ErroCEP(msg?: string) {
    this.toastr.error(msg, 'Erro!', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }


  // Validação customizada para garantir que as senhas sejam iguais
  senhasIguaisValidator(group: FormGroup): { [key: string]: boolean } | null {
    const senha = group.get('senha')?.value;
    const confirmasenha = group.get('confirmasenha')?.value;

    // Se as senhas não coincidirem, retorna um erro
    if (senha && confirmasenha && senha !== confirmasenha) {
      return { senhasNaoConferem: true };
    }
    return null;
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
            this.ErroCEP("CEP não encontrado");
          }
        },
        error => {
          this.ErroCEP("Erro ao buscar CEP");
        }
      );
    } else {
      this.ErroCEP("CEP inválido. Deve conter 8 dígitos.");
    }
  }

  verificarCnpj(): void {
    const cnpj = this.empresaForm.get('cnpj')?.value?.replace(/[^\d]+/g, '') || '';
    this.cnpjInvalido = !this.validarCNPJ(cnpj);
    if (this.cnpjInvalido) {
      this.ErroCNPJ("Digite corretamento o CNPJ");
    }
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

  onSubmit() {
    if (this.empresaForm.valid) {
      const dadosEmpresa = { ...this.empresaForm.value };
      delete dadosEmpresa.confirmasenha;
      this.spinner(true);
      this.CriarEmpresa();
      this.spinner(false);
    } else {
      this.empresaForm.markAllAsTouched();
    }
  }

  CriarEmpresa(): void {
    const dadosEmpresa = { ...this.empresaForm.value };
    const guidCliente = localStorage.getItem('guidCliente') as string;
    this.empresaService.enviarEmpresa(dadosEmpresa, guidCliente).subscribe(
      dados => {
        this.Sucesso("Cadastro realizado com sucesso!");
      },
      erro => {
        console.error("Erro no cadastro da empresa:", erro);
      }
    );
  }
}

