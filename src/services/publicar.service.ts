import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicarService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  Publicar(payload: any, id: number, tipoArquivo: number): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const params = new HttpParams()
      .set('id', id.toString())
      .set('TipoArquivo', tipoArquivo.toString());

    const url = `${this.apiUrl}/Publicar/PublicarMSG`;

    return this.http.post(url, payload, { headers, params });
  }

}
