import { Component } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { GrupoEmpresasService } from './../../../services/grupo-empresas.service';
import { EmpresaService } from 'src/services/empresa.service';
import { LocalStorageService } from 'src/app/local-storage.service';

@Component({
  selector: 'app-grupo-empresas',
  templateUrl: './grupo-empresas.component.html',
  styleUrls: ['./grupo-empresas.component.css']
})
export class GrupoEmpresasComponent {
  empresas: Empresa[] = [];
  carregando = false;

  constructor(private grupoEmpresasService: GrupoEmpresasService,
    private empresaService: EmpresaService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.spinner(true);
    this.carregarEmpresas();
    this.spinner(false);
  }

  spinner(valor: boolean) {
    this.carregando = valor;
    if (valor) {
      setTimeout(() => {
        this.carregando = false;
      }, 1000);
    }
  }

  carregarEmpresas(): void {
    const guidCliente = localStorage.getItem('guidCliente');
    if (guidCliente) {
      this.grupoEmpresasService.listarGrupoEmpresasPorId(guidCliente).subscribe({
        next: (dados: Empresa[]) => {
          this.empresas = dados;
        }
      });
    }
  }

  Status(id: number): void {
    this.empresaService.alterarStatus(id).subscribe({
      next: (res) => {
        this.carregarEmpresas();
      },
      error: (err) => {
        console.error('Erro ao alterar status:', err);
      }
    });
  }

}
