import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefoneMask'
})
export class TelefoneMaskPipe implements PipeTransform {

  transform(telefone: string): string {
    if (!telefone) return '';

    // Remove tudo que não for número
    telefone = telefone.replace(/\D/g, '');

    if (telefone.length === 11) {
      // Celular: (XX) XXXXX-XXXX
      return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (telefone.length === 10) {
      // Fixo: (XX) XXXX-XXXX
      return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else {
      // Retorna o número "cru" se tamanho diferente
      return telefone;
    }
  }

}
