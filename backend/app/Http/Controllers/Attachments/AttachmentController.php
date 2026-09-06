<?php

namespace App\Http\Controllers\Attachments;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attachments\StoreAttachmentRequest;
use App\Http\Resources\AttachmentResource;
use App\Models\Attachment;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function store(StoreAttachmentRequest $request, Task $task): JsonResponse
    {
        $this->authorize('create', [Attachment::class, $task]);

        $attachments = collect($request->file('files'))->map(function ($file) use ($task) {
            $path = $file->store('attachments/'.$task->id, 'public');

            return $task->attachments()->create([
                'disk' => 'public',
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);
        });

        return response()->json([
            'attachments' => AttachmentResource::collection($attachments),
        ], 201);
    }

    public function destroy(Attachment $attachment): JsonResponse
    {
        $this->authorize('delete', $attachment);

        Storage::disk($attachment->disk)->delete($attachment->path);
        $attachment->delete();

        return response()->json(status: 204);
    }
}
