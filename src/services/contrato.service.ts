import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
   private apiUrl = `${environment.apiUrl}`;
  

  constructor(private http: HttpClient) { }

   criarContrato(dados: any): Observable<any> {
  
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
  
      const url = `${this.apiUrl}/Contrato/Criar/`;
      return this.http.post(url, dados, { headers });
    }
  




}
