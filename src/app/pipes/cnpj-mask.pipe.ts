import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnpjMask'
})
export class CnpjMaskPipe implements PipeTransform {

  transform(cnpj: string): string {
    if (!cnpj) return '';

    // Remove tudo que não for número
    cnpj = cnpj.replace(/\D/g, '');

    // Aplica a máscara de CNPJ (XX.XXX.XXX/XXXX-XX)
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, 
                        '$1.$2.$3/$4-$5');
  }

}
