import { Component } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/services/empresa.service';

@Component({
  selector: 'app-grupo-empresas',
  templateUrl: './grupo-empresas.component.html',
  styleUrls: ['./grupo-empresas.component.css']
})
export class GrupoEmpresasComponent {
empresas: Empresa[] = [];

constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    //this.carregarEmpresas();
  }

  carregarEmpresas(): void {
      const clienteJson = localStorage.getItem('cliente');

      if (clienteJson) {
        const cliente = JSON.parse(clienteJson);
        const guidCliente = cliente.guidCliente;
        this.empresaService.enviarEmpresa(guidCliente).subscribe({
          next: (dados: Empresa[]) => {
            this.empresas = dados;
            console.log('Empresas carregadas:', this.empresas);
          }
        });
    }
  }
}
