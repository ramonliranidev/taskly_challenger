import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  private readonly _tags = signal<string[]>([]);
  readonly tags = this._tags.asReadonly();

  load(): void {
    this.http
      .get<{ tags: string[] }>(`${this.api}/tags`)
      .pipe(
        map((res) => res.tags),
        tap((tags) => this._tags.set(tags)),
      )
      .subscribe();
  }
}
