import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { registro, viagem } from '../types/models.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = `${environment.apiUrl}/reports`


  createReport(viagemId: number, reportData: any, files: File[]) {

    const formData = new FormData();

    for (const key in reportData) {
      formData.append(key, reportData[key])
    }

    for (const file of files) {
      const sanitizedFileName = file.name.replace(/\s+/g, '-'); 
      formData.append('files', file, sanitizedFileName)
    }
    console.log(formData)
    return this.http.post(`${this.apiUrl}/${viagemId}`, formData);
  }

  getReports(): Observable<registro[]> {
    return this.http.get<registro[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtém uma viagem por ID
  getReportById(id: number): Observable<registro> {
    console.log(id)
    return this.http.get<registro>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteTripId(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteTripMultiple(ids: number[]) {
    console.log(ids)

    return this.http.request('DELETE', `${this.apiUrl}`, {
      body: { ids }, // Aqui enviamos os IDs no corpo da requisição
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateTrip(dadosUpdate: any): Observable<viagem> {
    return this.http.put<viagem>(this.apiUrl, dadosUpdate).pipe(
      catchError(this.handleError)
    );
  }

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
