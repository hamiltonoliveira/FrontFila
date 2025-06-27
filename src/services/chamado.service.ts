import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatusChamado } from 'src/app/models/chamado.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {
private apiUrl = `${environment.apiUrl}`;
  guidCliente: string | null = null;
  
  constructor(private http: HttpClient) { }

  criarChamado(dados: StatusChamado): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
  
      const url = `${this.apiUrl}/Chamada/Criar`;
      return this.http.post(url, dados, { headers });
    }
    
    listarChamado(guidCliente: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const params = guidCliente;
    return this.http.get(`${this.apiUrl}/chamada/ListarChamado/${params}`, { headers });
  }
}
