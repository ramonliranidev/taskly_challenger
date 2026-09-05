<?php

namespace App\Http\Requests\Tasks;

use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'full_description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'status' => ['nullable', Rule::enum(TaskStatus::class)],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'O título é obrigatório.',
            'title.max' => 'O título deve ter no máximo 255 caracteres.',
            'short_description.max' => 'A descrição curta deve ter no máximo 255 caracteres.',
            'due_date.date' => 'Informe uma data/hora de prazo válida.',
            'status.enum' => 'Situação inválida.',
            'tags.array' => 'As tags devem ser enviadas como uma lista.',
            'tags.*.max' => 'Cada tag deve ter no máximo 255 caracteres.',
        ];
    }
}
