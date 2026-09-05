import { HttpErrorResponse } from '@angular/common/http';

import { ApiValidationError } from './auth.models';

export function toAuthErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ApiValidationError | string | null;

    if (body && typeof body === 'object') {
      const firstFieldError = Object.values(body.errors ?? {})[0]?.[0];
      if (firstFieldError) {
        return firstFieldError;
      }
      if (body.message) {
        return body.message;
      }
    }

    if (error.status === 0) {
      return 'Não foi possível conectar ao servidor. Tente novamente.';
    }
    if (error.status === 429) {
      return 'Muitas tentativas. Aguarde um instante e tente de novo.';
    }
  }

  return 'Algo deu errado. Tente novamente.';
}
