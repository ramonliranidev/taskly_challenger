<?php

namespace App\Models;

use App\Policies\AttachmentPolicy;
use Database\Factories\AttachmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable(['disk', 'path', 'original_name', 'mime_type', 'size'])]
#[UsePolicy(AttachmentPolicy::class)]
class Attachment extends Model
{
    /** @use HasFactory<AttachmentFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Task, $this>
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Apaga o arquivo do disco de cada anexo. `task_id`/`project_id` usam
     * `cascadeOnDelete()` no banco — a exclusão em cascata acontece direto
     * no SQL e não dispara eventos do Eloquent, então os controllers
     * precisam chamar isto explicitamente *antes* de apagar a
     * tarefa/projeto, ou o arquivo fica órfão no disco.
     *
     * @param  iterable<Attachment>  $attachments
     */
    public static function purgeFiles(iterable $attachments): void
    {
        foreach ($attachments as $attachment) {
            Storage::disk($attachment->disk)->delete($attachment->path);
        }
    }
}
