import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-brand-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <aside
      class="flex flex-col justify-start gap-10 border-r-2 border-ink bg-accent px-12 py-14 text-bg
             max-[900px]:border-r-0 max-[900px]:border-b-2 max-[900px]:px-6 max-[900px]:py-8"
    >
      <div class="flex items-baseline gap-3">
        <span class="text-[26px] font-extrabold tracking-[-0.02em]">TASKLY</span>
        <span class="text-[11px] uppercase tracking-[0.18em] opacity-80">Gestão de tarefas</span>
      </div>

      <div class="flex max-w-[460px] flex-col gap-7 max-[900px]:gap-4">
        <h1
          class="m-0 text-[64px] font-extrabold leading-[0.94] tracking-[-0.035em]
                 max-[900px]:text-[40px]"
        >
          O trabalho do dia, em ordem.
        </h1>
        <div class="h-0.5 bg-bg opacity-50 max-[900px]:hidden"></div>
        <p class="m-0 max-w-[380px] text-[16px] leading-[1.5] opacity-90 max-[900px]:hidden">
          Não é Jira ou um Notion, mas é <strong>QUASE</strong>.
        </p>
      </div>
    </aside>
  `,
})
export class BrandPanelComponent {}
