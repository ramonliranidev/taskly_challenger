import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Attachment } from '../../../core/tasks/task.models';
import { formatBytes } from '../../utils/format';
import { FileUploadComponent } from '../file-upload/file-upload.component';

const IMAGE_KINDS = ['PNG', 'JPG', 'JPEG', 'GIF'];

/**
 * Lista de anexos do painel de edição (README §5.7): selo de tipo (ou
 * miniatura em P&B para imagens — regra do design system, §12), nome,
 * tamanho e botão Remover; rodapé com o input de arquivo real.
 */
@Component({
  selector: 'app-attachment-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileUploadComponent],
  template: `
    <div class="flex flex-col border-2 border-ink/40">
      @for (attachment of attachments(); track attachment.id; let first = $first) {
        <div class="flex items-center gap-3 p-3" [class]="first ? '' : 'border-t-2 border-ink/40'">
          @if (isImage(attachment)) {
            <img
              [src]="attachment.url"
              [alt]="attachment.name"
              class="size-8 flex-none grayscale object-cover"
            />
          } @else {
            <span class="flex-none bg-ink px-1.5 py-0.5 text-[10px] font-extrabold text-bg">
              {{ attachment.kind }}
            </span>
          }
          <span class="min-w-0 flex-1 truncate text-[13px]">{{ attachment.name }}</span>
          <span class="flex-none text-[11px] text-muted">{{ formatBytes(attachment.size) }}</span>
          <button
            type="button"
            class="flex-none text-[11px] uppercase tracking-[0.12em] text-accent-700"
            (click)="removed.emit(attachment.id)"
          >
            Remover
          </button>
        </div>
      }
      <app-file-upload (filesSelected)="filesSelected.emit($event)" />
    </div>
  `,
})
export class AttachmentListComponent {
  readonly attachments = input.required<Attachment[]>();
  readonly filesSelected = output<FileList>();
  readonly removed = output<number>();

  protected readonly formatBytes = formatBytes;

  protected isImage(attachment: Attachment): boolean {
    return IMAGE_KINDS.includes(attachment.kind.toUpperCase());
  }
}
