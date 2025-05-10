import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  enviarEmpresa(dados: any, guidCliente: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrl}/EmpresaCliente/Criar?guidCliente=${guidCliente}`;
    return this.http.post(url, dados, { headers });
  }
}
