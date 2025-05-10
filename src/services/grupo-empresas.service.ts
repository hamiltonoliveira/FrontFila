import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoEmpresasService {
 private apiUrlLista = `${environment.apiUrl}`;
 guidCliente: string | null = null;

  constructor(private http: HttpClient)
  {}


listarGrupoEmpresasPorId(guidCliente: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  const params = guidCliente;
  return this.http.get(`${this.apiUrlLista}/EmpresaCliente/Lista/${params}`, { headers });
}

}
