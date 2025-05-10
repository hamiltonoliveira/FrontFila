import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';

  constructor(private authService: AuthService,
              private router: Router,) {}

  onSubmit(): void {
    if (!this.email || !this.senha) {
      console.warn('Preencha todos os campos!');
      return;
    }

    this.authService.login(this.email, this.senha).subscribe({
      next: (res) => {
        if (res.token) {
          localStorage.setItem('token', res.token.token);
          localStorage.setItem('refreshToken', res.token.refreshToken);
          localStorage.setItem('guidCliente', res.guidCliente);
          // aqui sera boas vindas ou algo de marketing ou painel de controle
          this.router.navigate(['/menu']);
        } else {
          console.warn('Token não recebido!');
        }
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err);
      }
    });
  }
}
