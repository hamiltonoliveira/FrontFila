import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/local-storage.service';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoEmpresasService {
 private apiUrlLista = `${environment.apiUrl}/listar`;
 guidCliente: string | null = null;

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService)
  {this.ooo();}

  ooo(){
   console.log("DFFFFFFF",this.apiUrlLista)
  }

  listarGrupoEmpresasPorId(guidCliente: string) {
    console.log('guidCliente:', this.apiUrlLista);
    return this.http.get(`${this.apiUrlLista}/${guidCliente}`);
  }



}
