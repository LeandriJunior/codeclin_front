import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  data: any;
  readonly API_BACK: string = environment.API_BACK

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  setSessaoUsuario(value): void {
    this.clearSessaoUsuario()
    localStorage.setItem('sessao', JSON.stringify(value))
  }
  
  getSessaoUsuario(): any {
      return JSON.parse(localStorage.getItem('sessao'))
  }

  clearSessaoUsuario(): void {
    localStorage.removeItem('sessao');
  }

  getToken(): any {
    return JSON.parse(localStorage.getItem('token'));
  }

  setToken(token: any): void {
    this.clearToken();
    localStorage.setItem('token', JSON.stringify(token));
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  getJwtDecoded(): any {
    try {
      return jwtDecode(this.getToken().token_aplicativo);
    }
    catch (error) {
      //
    }
  }
  logout(){
    this.clearToken()
    this.clearSessaoUsuario()
    this.router.navigate(['login'])
  }

}
