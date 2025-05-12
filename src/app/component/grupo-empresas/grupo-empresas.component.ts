import { Component } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { GrupoEmpresasService } from './../../../services/grupo-empresas.service';
import { EmpresaService } from 'src/services/empresa.service';

@Component({
  selector: 'app-grupo-empresas',
  templateUrl: './grupo-empresas.component.html',
  styleUrls: ['./grupo-empresas.component.css']
})
export class GrupoEmpresasComponent {
empresas: Empresa[] = [];

constructor(private grupoEmpresasService: GrupoEmpresasService,
            private empresaService: EmpresaService
            ) {}

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  carregarEmpresas(): void {
      const guidCliente = localStorage.getItem('guidCliente');
      if (guidCliente) {
        this.grupoEmpresasService.listarGrupoEmpresasPorId(guidCliente).subscribe({
          next: (dados: Empresa[]) => {
            this.empresas = dados;
            console.log('Empresas carregadas:', this.empresas);
          }
        });
    }
  }

  Status(id: number): void {
    console.log('ID recebido:', id);
    this.empresaService.alterarStatus(id).subscribe({
      next: (res) => {
        console.log('Status alterado com sucesso:', res);
        // Atualiza a lista de empresas após alterar o status
        this.carregarEmpresas();
      },
      error: (err) => {
        console.error('Erro ao alterar status:', err);
      }
    });
  }

  }
