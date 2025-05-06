import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscepService {

  private readonly viaCepUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  buscarPorCep(cep: string): Observable<any> {
    const url = `${this.viaCepUrl}/${cep}/json/`;
    return this.http.get<any>(url);
  }
}
