import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { viagem } from '../types/models.type';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ViagensService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.user = this.authService.getUserFromToken()
  }

  private apiUrl = `${environment.apiUrl}/trips`
  private user: any

  createTrip(dadosTrip: viagem, user: any): Observable<viagem> {
    const body = {
      ...dadosTrip,
      user: JSON.stringify(user)
    }
    return this.http.post<viagem>(this.apiUrl, body).pipe(
      catchError(this.handleError)
    );
  }

  // Obtém todas as viagens
  getTrips(): Observable<viagem[]> {
    return this.http.get<viagem[]>(`${this.apiUrl}?userId=${this.user.id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtém uma viagem por ID
  getTripById(id: number): Observable<viagem> {
    console.log(id)
    return this.http.get<viagem>(`${this.apiUrl}/${id}?userId=${this.user.id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Atualiza uma viagem existente
  updateTrip(dadosUpdate: viagem): Observable<viagem> {
    return this.http.put<viagem>(this.apiUrl, {
      updateData: dadosUpdate,
      userId: this.user.id
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTripId(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}?userId=${this.user.id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteTripMultiple(ids: number[]) {
    console.log(ids);

    return this.http.request('DELETE', `${this.apiUrl}`, {
      body: { ids, userId: this.user.id }, // Mando tudo junto
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Tratamento de erros
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }


  faturamento(mesReferente?: number, anoReferente?: number): Observable<any> {
    let params = new HttpParams().set('userId', this.user.id);

    if (mesReferente !== undefined) {
      params = params.set('mesReferente', mesReferente.toString());
    }
    if (anoReferente !== undefined) {
      params = params.set('anoReferente', anoReferente.toString());
    }

    return this.http.get(`${this.apiUrl}/invoicing/history`, { params }).pipe(
      catchError(this.handleError)
    );
  }

}
