<?php

namespace App\Http\Requests\Attachments;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttachmentRequest extends FormRequest
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
            'files' => ['required', 'array', 'min:1'],
            'files.*' => ['file', 'mimes:png,jpg,jpeg,gif,pdf,doc,docx', 'max:10240'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'files.required' => 'Selecione ao menos um arquivo.',
            'files.array' => 'Envie os arquivos em uma lista.',
            'files.*.file' => 'Um dos itens enviados não é um arquivo válido.',
            'files.*.mimes' => 'Formato de arquivo não suportado.',
            'files.*.max' => 'O arquivo deve ter no máximo 10MB.',
        ];
    }
}
