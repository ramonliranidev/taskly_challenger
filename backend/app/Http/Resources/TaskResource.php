<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'title' => $this->title,
            'short_description' => $this->short_description,
            'full_description' => $this->full_description,
            'due_date' => $this->due_date?->toIso8601String(),
            'status' => $this->status->value,
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->pluck('name')->values()),
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
