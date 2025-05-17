import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cepMask'
})
export class CepMaskPipe implements PipeTransform {
  transform(cep: string): string {
    if (!cep) return '';
    cep = cep.replace(/\D/g, '');
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
}
