import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { BrandPanelComponent } from './brand-panel.component';

type AuthMode = 'login' | 'signup';

/**
 * Casca compartilhada das telas de autenticação: layout de duas colunas,
 * painel-pôster à esquerda e, à direita, abas + cabeçalho + réguas.
 *
 * É a própria rota-pai de /login e /cadastro (ver app.routes.ts): as duas
 * telas são filhas dela e trocam apenas pelo `<router-outlet>` interno, para
 * que o painel-pôster e as abas não sejam destruídos/recriados ao alternar.
 *
 * A coluna da direita fica alinhada ao topo (não centralizada). O cadastro
 * tem um campo a mais e é mais alto que o login; centralizar verticalmente
 * faria as abas subirem/descerem de posição a cada troca — é essa diferença
 * de altura entre os dois formulários, e não a troca de rota em si, que
 * causava o "flick" para cima e para baixo. Com o topo fixo, só o conteúdo
 * abaixo das abas cresce para baixo.
 */
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

  /** Deriva o modo (login/cadastro) da URL ativa em vez de um @Input — a
   * rota filha é quem muda agora, esta casca fica montada o tempo todo. */
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
