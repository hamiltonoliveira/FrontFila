import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PainelService {

  private apiUrlLista = `${environment.apiUrl}`;
  guidCliente: string | null = null;

  constructor(private http: HttpClient) { }

  listarMGS(guidCliente: string, selectedValue:number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const params1 = guidCliente;
    const params2 = selectedValue;
    return this.http.get(`${this.apiUrlLista}/Painel/painel/?guidcliente=${params1}&status=${params2}`, { headers });
  }

  CalculadoraGuid(guid: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const params = guid;
    return this.http.get(`${this.apiUrlLista}/Painel/calculadora/?guid=${params}`, { headers });
  }

  DownloadFila(nomeFila: string): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrlLista}/Publicar/DownloadMSG?nomeFila=${nomeFila}`, {
      headers,
      responseType: 'blob'
    });
  }
}
