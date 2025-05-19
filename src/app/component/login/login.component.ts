import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';

  constructor(private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

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
          this.Sucesso("Seja bem-vindo.");
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
