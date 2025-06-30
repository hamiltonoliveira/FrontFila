import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chamado',
  templateUrl: './chamado.component.html'
})
export class ChamadoComponent implements OnInit {
  meuForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.meuForm = this.fb.group({
      titulo: [''],
      descricao: [''],
      resposta: [''], 
      dataEncerramento: [''], 
      status: [0]
    });
  }
}
