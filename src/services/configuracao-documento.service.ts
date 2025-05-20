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

    const url = `${this.apiUrl}/ConfiguracaoDocumento/Criar?guid=${guidCliente}`;
    return this.http.post(url, dados, { headers });
  }

  Status(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/ConfiguracaoDocumento/MudarStatus?id=${id}`;
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
}
