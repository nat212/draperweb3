import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }

  public isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>('/api/auth/authenticated');
  }
}
