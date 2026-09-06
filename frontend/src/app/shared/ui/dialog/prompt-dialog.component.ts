import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  viewChild,
} from '@angular/core';

/**
 * Diálogo genérico sobre `<dialog>` nativo. ESC e clique fora fecham sem
 * emitir `confirmed` — só o submit do form emite.
 *
 * Host `contents`: sem isso o elemento host (bloco comum, ao contrário do
 * `<dialog>` fechado que já é `display: none`) ocupa uma célula do grid/flex
 * do pai mesmo escondido.
 */
@Component({
  selector: 'app-prompt-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <dialog #dialogEl class="w-[min(400px,92vw)]">
      <form method="dialog" class="flex flex-col gap-5 p-6" (submit)="confirm()">
        <h2 class="m-0 text-[20px] font-extrabold tracking-[-0.02em]">{{ title() }}</h2>

        @if (message()) {
          <p class="m-0 text-[14px] text-muted">{{ message() }}</p>
        }

        @if (showInput()) {
          <input
            class="field-input"
            [value]="value()"
            [placeholder]="placeholder()"
            [attr.list]="suggestions().length ? listId : null"
            (input)="value.set($any($event.target).value)"
          />
          @if (suggestions().length) {
            <datalist [id]="listId">
              @for (suggestion of suggestions(); track suggestion) {
                <option [value]="suggestion"></option>
              }
            </datalist>
          }
        }

        <div class="flex items-center justify-end gap-4">
          <button
            type="button"
            class="text-[13px] uppercase tracking-[0.14em] text-muted"
            (click)="cancel()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="auth-submit w-auto px-5"
            [disabled]="showInput() && !value().trim()"
          >
            {{ confirmLabel() }}
          </button>
        </div>
      </form>
    </dialog>
  `,
})
export class PromptDialogComponent {
  private static nextId = 0;

  readonly title = signal('');
  readonly message = signal('');
  readonly showInput = signal(true);
  readonly confirmLabel = signal('Salvar');
  readonly placeholder = signal('');
  readonly value = signal('');
  readonly suggestions = signal<string[]>([]);

  /** Id único do `<datalist>` — pode haver mais de um diálogo montado ao mesmo tempo. */
  protected readonly listId = `prompt-dialog-suggestions-${PromptDialogComponent.nextId++}`;

  readonly confirmed = output<string>();

  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  open(options: {
    title: string;
    message?: string;
    showInput?: boolean;
    confirmLabel?: string;
    placeholder?: string;
    initialValue?: string;
    suggestions?: string[];
  }): void {
    this.title.set(options.title);
    this.message.set(options.message ?? '');
    this.showInput.set(options.showInput ?? true);
    this.confirmLabel.set(options.confirmLabel ?? 'Salvar');
    this.placeholder.set(options.placeholder ?? '');
    this.value.set(options.initialValue ?? '');
    this.suggestions.set(options.suggestions ?? []);
    this.dialogEl().nativeElement.showModal();
  }

  protected confirm(): void {
    this.confirmed.emit(this.value().trim());
  }

  protected cancel(): void {
    this.dialogEl().nativeElement.close();
  }
}
