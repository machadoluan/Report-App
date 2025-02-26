import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { viagem } from '../types/models.type';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViagensService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = 'http://localhost:3000/trips'

  createTrip(dadosTrip: viagem): Observable<viagem> {
    return this.http.post<viagem>(this.apiUrl, dadosTrip).pipe(
      catchError(this.handleError)
    );
  }

  // Obtém todas as viagens
  getTrips(): Observable<viagem[]> {
    return this.http.get<viagem[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtém uma viagem por ID
  getTripById(id: number): Observable<viagem> {
    console.log(id)
    return this.http.get<viagem>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Atualiza uma viagem existente
  updateTrip(dadosUpdate: viagem): Observable<viagem> {
    return this.http.put<viagem>(this.apiUrl, dadosUpdate).pipe(
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

}
