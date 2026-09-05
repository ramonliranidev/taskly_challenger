<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AttachmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kind' => strtoupper(pathinfo($this->original_name, PATHINFO_EXTENSION)),
            'name' => $this->original_name,
            'size' => $this->size,
            'url' => Storage::disk($this->disk)->url($this->path),
        ];
    }
}
