import { ChangeDetectionStrategy, Component, ElementRef, output, viewChild } from '@angular/core';
import { LucideImage } from '@lucide/angular';

/**
 * Botão "+ Anexar arquivo ou foto" real (README §5.7): dispara um
 * `<input type="file">` escondido e emite a `FileList` escolhida — sem
 * preview local, a miniatura vem pronta na resposta do upload (ver
 * `TasksService.uploadAttachments`).
 */
@Component({
  selector: 'app-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideImage],
  template: `
    <button
      type="button"
      class="flex w-full items-center gap-2 border-t-2 border-dashed border-ink/40 px-3 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-[0.14em] text-accent-700 hover:bg-field"
      (click)="trigger()"
    >
      <svg lucideImage class="size-4" />
      + Anexar arquivo ou foto
    </button>
    <input
      #fileInput
      type="file"
      multiple
      accept="image/*,.pdf,.doc,.docx"
      class="hidden"
      (change)="onChange($event)"
    />
  `,
})
export class FileUploadComponent {
  readonly filesSelected = output<FileList>();

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected trigger(): void {
    this.fileInput().nativeElement.click();
  }

  protected onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.filesSelected.emit(input.files);
    }
    input.value = '';
  }
}
