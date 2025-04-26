import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = `${environment.apiUrl}/auth`


  login(dadosLogin: any) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, dadosLogin)
  }

  register(dadosRegistro: any) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/register`, dadosRegistro)
  }

  isAuthenticado(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserFromToken(): any | null {
    let token = this.getToken();
  
    if (!token) {
      return null;
    }
  
    try {
      token = token.split('#')[0].trim();
  
      const tokenPayload = token.split('.')[1];
  
      // Decodificação correta do Base64Url
      const decodedPayload = JSON.parse(this.decodeBase64Url(tokenPayload));
  
      return decodedPayload;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  private decodeBase64Url(str: string): string {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    return atob(base64 + padding);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  verifyToken(token: string){
    return this.http.post(`${this.apiUrl}/verify-token`, { token });
  }
}
