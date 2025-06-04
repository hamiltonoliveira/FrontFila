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

  listarMGS(guidCliente: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const params = guidCliente;

    console.log(`${this.apiUrlLista}/Painel/painel/${params}`)
    return this.http.get(`${this.apiUrlLista}/Painel/painel/?guidcliente=${params}`, { headers });
  }
}
