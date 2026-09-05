import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AuthResponse } from './auth.models';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const response: AuthResponse = {
    user: { id: 1, name: 'Ada', email: 'ada@example.com' },
    token: 'tok_123',
    token_type: 'Bearer',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('starts unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('persists token and user after login', () => {
    service.login({ email: 'ada@example.com', password: 'secret123' }).subscribe();

    const req = http.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(response);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.user()?.email).toBe('ada@example.com');
    expect(localStorage.getItem('taskly.token')).toBe('tok_123');
  });

  it('clears the session on logout', () => {
    service.login({ email: 'ada@example.com', password: 'secret123' }).subscribe();
    http.expectOne(`${environment.apiUrl}/login`).flush(response);

    service.logout();
    http.expectOne(`${environment.apiUrl}/logout`).flush({});

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('taskly.token')).toBeNull();
  });
});
