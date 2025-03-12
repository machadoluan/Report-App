import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

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

  isAuthenticado(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserFromToken(): any | null {
    const token = this.getToken();
    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(tokenPayload));
      return decodedPayload;
    }
    return null;
  }


}
