import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Salva um item no localStorage
  setItem(key: string, value: any): void {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  }

  // Recupera um item do localStorage
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? item as T : null;
  }

  // Remove um item do localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Limpa todo o localStorage
  clear(): void {
    localStorage.clear();
  }

  // Verifica se uma chave existe
  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
