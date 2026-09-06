<?php

namespace App\Http\Requests\Tasks;

use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Todos os campos são `sometimes`: o painel salva por campo, então uma
 * requisição pode trazer só um campo ou vários.
 */
class UpdateTaskRequest extends FormRequest
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
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'short_description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'full_description' => ['sometimes', 'nullable', 'string'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'status' => ['sometimes', Rule::enum(TaskStatus::class)],
            'tags' => ['sometimes', 'array'],
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
