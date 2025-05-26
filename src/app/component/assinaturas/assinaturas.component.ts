import { Component, Input } from '@angular/core';
import { AssinaturaEletronicaService } from 'src/services/assinatura-eletronica.service';

@Component({
  selector: 'app-assinaturas',
  templateUrl: './assinaturas.component.html',
  styleUrls: ['./assinaturas.component.css']
})
export class AssinaturasComponent {

  planoSelecionado: string = '';

  constructor(private assinaturaEletronicaService: AssinaturaEletronicaService) { }

  selecionarPlano(codigo: number) {
    const planos: { [key: number]: string } = {
      1: 'basico',
      2: 'profissional',
      3: 'empresarial'
    };

    this.planoSelecionado = planos[codigo] || '';
  }
}
