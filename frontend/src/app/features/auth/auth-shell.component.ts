import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { BrandPanelComponent } from './brand-panel.component';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-auth-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet, BrandPanelComponent],
  template: `
    <div class="grid min-h-screen grid-cols-[1.05fr_1fr] max-[900px]:grid-cols-1">
      <app-brand-panel />

      <div
        class="flex items-start justify-start px-16 py-14 max-[900px]:px-6 max-[900px]:py-8"
      >
        <div class="flex w-full max-w-[420px] flex-col gap-8">
          <nav class="grid grid-cols-2 border-2 border-ink">
            <a
              routerLink="/login"
              class="px-[18px] py-3.5 text-left text-[13px] font-extrabold uppercase tracking-[0.14em] no-underline"
              [class]="mode() === 'login' ? 'bg-ink text-bg' : 'bg-transparent text-ink'"
            >
              Entrar
            </a>
            <a
              routerLink="/cadastro"
              class="px-[18px] py-3.5 text-left text-[13px] font-extrabold uppercase tracking-[0.14em] no-underline"
              [class]="mode() === 'signup' ? 'bg-ink text-bg' : 'bg-transparent text-ink'"
            >
              Criar conta
            </a>
          </nav>

          <header class="flex flex-col gap-2.5">
            <span class="text-[11px] uppercase tracking-[0.18em] text-muted">{{ kicker() }}</span>
            <h2 class="m-0 text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em]">
              {{ heading() }}
            </h2>
          </header>

          <div class="h-0.5 bg-ink/40"></div>

          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class AuthShellComponent {
  private readonly router = inject(Router);

  protected readonly mode = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.resolveMode()),
      startWith(this.resolveMode()),
    ),
    { initialValue: this.resolveMode() },
  );

  protected readonly kicker = computed(() =>
    this.mode() === 'signup' ? 'Nova conta' : 'Bem-vindo de volta',
  );
  protected readonly heading = computed(() =>
    this.mode() === 'signup' ? 'Criar sua conta' : 'Entrar no Taskly',
  );

  private resolveMode(): AuthMode {
    return this.router.url.includes('cadastro') ? 'signup' : 'login';
  }
}
