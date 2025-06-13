import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  nomeFantasia: string = '';

  constructor(private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService) { this.obterNome(); }

  obterNome(): void {
    const empresas = this.localStorageService.getItem<{ nomeFantasia: string }[]>("empresas-grupo");
    if (empresas && empresas.length > 0) {
      this.nomeFantasia = empresas[0].nomeFantasia;
    }
  }


  Sucesso(msg?: string) {
    this.toastr.success(msg, 'Sucesso!', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  Erro(msg?: string) {
    this.toastr.error(msg, 'Erro!', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  onSubmit(): void {
    if (!this.email || !this.senha) {
      this.Erro("'Preencha todos os campos!");
      return;
    }



    this.authService.login(this.email, this.senha).subscribe({
      next: (res) => {
        if (res.token) {
          localStorage.setItem('token', res.token.token);
          localStorage.setItem('refreshToken', res.token.refreshToken);
          localStorage.setItem('guidCliente', res.guidCliente);
       
          this.Sucesso(`Seja bem-vindo. ${this.nomeFantasia}`);
          this.router.navigate(['/contrato']);
        } else {
          this.Erro("Token não recebido!");
        }
      },
      error: (err) => {
        this.Erro("Erro ao fazer login");
      }
    });
  }
}
