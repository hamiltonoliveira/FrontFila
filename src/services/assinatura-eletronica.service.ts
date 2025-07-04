import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssinaturaEletronicaService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  criarFila(dados: any): Observable<any> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/Assinatura/Criar/`;
    return this.http.post(url, dados, { headers });
  }

   listarContratoGuid(guid: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const params = guid;
    return this.http.get(`${this.apiUrl}/Assinatura/GetGuid/${params}`, { headers });
  }

  imprimeContratoGuid(guid: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const params = guid;
    return this.http.get(`${this.apiUrl}/Contrato/imprimir?guidcliente=${params}`, { headers });
  }
}
