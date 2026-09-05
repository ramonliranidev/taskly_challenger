import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LucidePlus } from '@lucide/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { Project } from '../../../core/projects/project.models';
import { ProjectsService } from '../../../core/projects/projects.service';
import { TasksService } from '../../../core/tasks/tasks.service';
import { PromptDialogComponent } from '../../../shared/ui/dialog/prompt-dialog.component';
import { ProjectListItemComponent } from './project-list-item.component';

/** Sidebar de projetos (240px, README §2) — lista, criar/renomear (via
 * `<dialog>` nativo, substitui `window.prompt`), o rodapé de progresso e a
 * conta do usuário logado. Rola de forma independente da área de conteúdo
 * (`overflow-y-auto` — ver WorkspaceComponent), então o bloco de
 * conta/Desconectar (fixado na base via `mt-auto`) sempre fica visível. */
@Component({
  selector: 'app-project-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Host "invisível" pro layout: quem participa do grid da tela é o
  // próprio <aside> (mesmo truque do BrandPanelComponent das telas de auth).
  host: { class: 'contents' },
  imports: [ProjectListItemComponent, PromptDialogComponent, LucidePlus],
  template: `
    <aside class="flex h-full flex-col overflow-y-auto border-r-2 border-ink">
      <div class="flex items-center justify-between gap-2 pt-5 pr-6 pb-3 pl-6">
        <span class="text-[11px] tracking-[0.18em] text-muted uppercase">Projetos</span>
        <span class="text-[11px] font-extrabold text-muted">{{ projects.projects().length }}</span>
      </div>

      <div class="flex flex-col">
        @for (project of projects.projects(); track project.id) {
          <app-project-list-item
            [project]="project"
            [active]="project.id === projects.activeProjectId()"
            (selected)="projects.selectProject(project.id)"
            (renamed)="openRename(project)"
          />
        }
      </div>

      <button
        type="button"
        class="mx-6 my-4 flex items-center gap-2 border-2 border-ink/40 px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.14em] text-accent-700 uppercase hover:border-accent"
        (click)="openCreate()"
      >
        <svg lucidePlus class="size-3.5" />
        Novo projeto
      </button>

      <div class="mt-auto flex flex-col gap-1.5 border-t-2 border-ink/40 py-5 pr-6 pl-6">
        <span class="text-[11px] tracking-[0.18em] text-muted uppercase">Neste projeto</span>
        <span class="text-[30px] leading-none font-extrabold">
          {{ tasks.counts().done }} / {{ tasks.counts().total }}
        </span>
        <span class="text-[12px] text-muted">tarefas concluídas</span>
      </div>

      <div class="flex flex-col border-t-2 border-ink">
        <div class="flex items-center gap-2.5 pt-3.5 pr-6 pb-3 pl-6">
          <span
            class="flex size-7 flex-none items-center justify-center bg-ink text-[11px] font-extrabold text-bg"
          >
            {{ initials() }}
          </span>
          <div class="flex min-w-0 flex-col gap-px">
            <span class="text-[10px] tracking-[0.16em] text-muted uppercase">Conectado</span>
            <span class="truncate text-[12px] font-semibold" [title]="email()">{{ email() }}</span>
          </div>
        </div>
        <button
          type="button"
          class="w-full border-t-2 border-ink/40 px-6 py-3 text-left text-[11px] font-semibold tracking-[0.14em] text-muted uppercase hover:bg-accent hover:text-bg"
          (click)="openLogoutDialog()"
        >
          Desconectar
        </button>
      </div>
    </aside>

    <app-prompt-dialog #projectDialog (confirmed)="onDialogConfirmed($event)" />
    <app-prompt-dialog #logoutDialog (confirmed)="onLogoutConfirmed()" />
  `,
})
export class ProjectSidebarComponent {
  protected readonly projects = inject(ProjectsService);
  protected readonly tasks = inject(TasksService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly projectDialog = viewChild.required<PromptDialogComponent>('projectDialog');
  private readonly logoutDialog = viewChild.required<PromptDialogComponent>('logoutDialog');
  private renamingProjectId: number | null = null;

  protected readonly email = computed(() => this.auth.user()?.email ?? '');
  protected readonly initials = computed(() => this.email().slice(0, 2).toUpperCase());

  protected openCreate(): void {
    this.renamingProjectId = null;
    this.projectDialog().open({
      title: 'Novo projeto',
      confirmLabel: 'Criar',
      placeholder: 'Nome do projeto',
    });
  }

  protected openRename(project: Project): void {
    this.renamingProjectId = project.id;
    this.projectDialog().open({
      title: 'Renomear projeto',
      confirmLabel: 'Salvar',
      initialValue: project.name,
    });
  }

  protected onDialogConfirmed(name: string): void {
    if (!name) {
      return;
    }
    if (this.renamingProjectId !== null) {
      this.projects.rename(this.renamingProjectId, name).subscribe();
    } else {
      this.projects.create(name).subscribe();
    }
  }

  protected openLogoutDialog(): void {
    this.logoutDialog().open({
      title: 'Sair da conta?',
      showInput: false,
      confirmLabel: 'Sair',
    });
  }

  protected onLogoutConfirmed(): void {
    setTimeout(() => {
      this.auth.logout();
      void this.router.navigateByUrl('/login');
    });
  }
}
