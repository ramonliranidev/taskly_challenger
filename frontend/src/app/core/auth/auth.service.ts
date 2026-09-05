import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from './auth.models';

const TOKEN_KEY = 'taskly.token';
const USER_KEY = 'taskly.user';

/**
 * Autenticação da SPA: fala com os endpoints do backend em
 * `environment.apiUrl` e persiste a sessão (token + usuário) no
 * `localStorage`, de modo que um refresh mantém o usuário logado.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  private readonly _token = signal<string | null>(readStorage(TOKEN_KEY));
  private readonly _user = signal<AuthUser | null>(readJson<AuthUser>(USER_KEY));

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/register`, payload)
      .pipe(tap((res) => this.persist(res)));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/login`, payload)
      .pipe(tap((res) => this.persist(res)));
  }

  logout(): void {
    if (this._token()) {
      this.http.post(`${this.api}/logout`, {}).subscribe({ error: () => void 0 });
    }
    this.clear();
  }

  clear(): void {
    this._token.set(null);
    this._user.set(null);
    writeStorage(TOKEN_KEY, null);
    writeStorage(USER_KEY, null);
  }

  private persist(res: AuthResponse): void {
    this._token.set(res.token);
    this._user.set(res.user);
    writeStorage(TOKEN_KEY, res.token);
    writeStorage(USER_KEY, JSON.stringify(res.user));
  }
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readJson<T>(key: string): T | null {
  const raw = readStorage(key);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null): void {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch {
    /* localStorage indisponível (modo privado, etc.) — sessão fica só em memória. */
  }
}
