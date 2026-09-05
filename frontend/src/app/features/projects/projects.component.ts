import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto flex min-h-screen max-w-[720px] flex-col gap-6 px-6 py-14">
      <header class="flex items-center justify-between gap-4 border-b-2 border-ink pb-4">
        <span class="text-[22px] font-extrabold tracking-[-0.02em]">TASKLY</span>
        <button type="button" class="auth-link text-[13px]" (click)="logout()">Sair</button>
      </header>

      <div class="flex flex-col gap-2">
        <span class="text-[11px] uppercase tracking-[0.18em] text-muted">Sessão ativa</span>
        <h1 class="m-0 text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em]">Projetos</h1>
        <p class="m-0 text-[15px] text-muted">
          Olá, {{ auth.user()?.name }} — em breve seus projetos aparecem aqui.
        </p>
      </div>
    </div>
  `,
})
export class ProjectsComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
