import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoDocumentoService {
  private apiUrl = `${environment.apiUrl}`;
  guidCliente: string | null = null;

  constructor(private http: HttpClient) { }


  criarFila(guidCliente: string, dados: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/ConfiguracaoDocumento/criar?guidCliente=${guidCliente}`;
    return this.http.post(url, dados, { headers });
  }

  Status(guid: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/ConfiguracaoDocumento/MudarStatus?guid=${guid}`;
    return this.http.post(url, null, { headers });
  }

  listarConfiguracao(guidCliente: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const params = guidCliente;
    return this.http.get(`${this.apiUrl}/ConfiguracaoDocumento/Listar/${params}`, { headers });
  }

   listarConfiguracaoGuid(guid: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const params = guid;
    return this.http.get(`${this.apiUrl}/ConfiguracaoDocumento/GetGuid/${params}`, { headers });
  }
}
