<?php

namespace App\Http\Controllers\Tasks;

use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tasks\StoreTaskRequest;
use App\Http\Requests\Tasks\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Attachment;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    /**
     * Lista as tarefas de um projeto do usuário autenticado.
     */
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $tasks = $project->tasks()->with(['tags', 'attachments'])->oldest()->get();

        return response()->json([
            'tasks' => TaskResource::collection($tasks),
        ]);
    }

    /**
     * Cria uma nova tarefa dentro de um projeto do usuário autenticado.
     */
    public function store(StoreTaskRequest $request, Project $project): JsonResponse
    {
        $this->authorize('create', [Task::class, $project]);

        $data = $request->validated();
        $tags = $data['tags'] ?? null;
        unset($data['tags']);
        $data['status'] ??= TaskStatus::NotStarted->value;

        $task = $project->tasks()->create($data);

        if ($tags !== null) {
            $this->syncTags($task, $tags, $request->user());
        }

        return response()->json([
            'task' => new TaskResource($task->load(['tags', 'attachments'])),
        ], 201);
    }

    /**
     * Exibe uma tarefa do usuário autenticado.
     */
    public function show(Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        return response()->json([
            'task' => new TaskResource($task->load(['tags', 'attachments'])),
        ]);
    }

    /**
     * Atualiza uma tarefa do usuário autenticado — só toca os campos enviados
     * (painel de edição salva por campo, ver UpdateTaskRequest).
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $data = $request->validated();
        $hasTags = array_key_exists('tags', $data);
        $tags = $data['tags'] ?? null;
        unset($data['tags']);

        $task->update($data);

        if ($hasTags) {
            $this->syncTags($task, $tags ?? [], $request->user());
        }

        return response()->json([
            'task' => new TaskResource($task->load(['tags', 'attachments'])),
        ]);
    }

    /**
     * Exclui uma tarefa do usuário autenticado (cascata: tags e anexos).
     */
    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        Attachment::purgeFiles($task->attachments);
        $task->delete();

        return response()->json(status: 204);
    }

    /**
     * Sincroniza as tags de uma tarefa a partir de uma lista de nomes,
     * criando (ou reaproveitando) as tags do próprio usuário. Usa a relação
     * `$user->tags()` (em vez de `Tag::create`) para que o `user_id` seja
     * preenchido pela própria relação — `Tag` só declara `name` como
     * `#[Fillable]`, então um `create()`/`firstOrCreate()` direto no Model
     * descartaria o `user_id` silenciosamente.
     *
     * @param  array<int, string>  $names
     */
    private function syncTags(Task $task, array $names, User $user): void
    {
        $ids = collect($names)
            ->map(fn (string $name) => trim($name))
            ->filter()
            ->unique()
            ->map(fn (string $name) => $user->tags()->firstOrCreate(['name' => $name])->id)
            ->all();

        $task->tags()->sync($ids);
    }
}
