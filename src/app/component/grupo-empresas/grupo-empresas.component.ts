import { Component } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { GrupoEmpresasService } from './../../../services/grupo-empresas.service';

@Component({
  selector: 'app-grupo-empresas',
  templateUrl: './grupo-empresas.component.html',
  styleUrls: ['./grupo-empresas.component.css']
})
export class GrupoEmpresasComponent {
empresas: Empresa[] = [];

constructor(private grupoEmpresasService: GrupoEmpresasService) {}

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
}
