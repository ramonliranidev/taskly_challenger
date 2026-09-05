<?php

namespace Tests\Feature\Tasks;

use App\Enums\TaskStatus;
use App\Models\Attachment;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_tasks_with_tags_and_attachments(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();
        $tag = Tag::factory()->for($user)->create(['name' => 'Design']);
        $task->tags()->attach($tag);

        $response = $this->actingAs($user)->getJson("/api/projects/{$project->id}/tasks");

        $response->assertOk()
            ->assertJsonCount(1, 'tasks')
            ->assertJsonPath('tasks.0.id', $task->id)
            ->assertJsonPath('tasks.0.tags.0', 'Design')
            ->assertJsonPath('tasks.0.attachments', []);
    }

    public function test_index_denies_access_to_other_users_project(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner)->create();
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->getJson("/api/projects/{$project->id}/tasks")
            ->assertForbidden();
    }

    public function test_store_creates_task_with_defaults(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();

        $response = $this->actingAs($user)->postJson("/api/projects/{$project->id}/tasks", [
            'title' => 'Nova tarefa',
        ]);

        $response->assertCreated()
            ->assertJsonPath('task.title', 'Nova tarefa')
            ->assertJsonPath('task.status', TaskStatus::NotStarted->value);

        $this->assertDatabaseHas('tasks', [
            'project_id' => $project->id,
            'title' => 'Nova tarefa',
        ]);
    }

    public function test_store_creates_task_and_finds_or_creates_tags(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $existing = Tag::factory()->for($user)->create(['name' => 'Design']);

        $response = $this->actingAs($user)->postJson("/api/projects/{$project->id}/tasks", [
            'title' => 'Nova tarefa',
            'tags' => ['Design', 'UI'],
        ]);

        $response->assertCreated();
        $task = Task::firstWhere('title', 'Nova tarefa');

        $this->assertSame(['Design', 'UI'], $task->tags()->orderBy('name')->pluck('name')->all());
        $this->assertDatabaseCount('tags', 2);
        $this->assertTrue($task->tags->contains($existing));
    }

    public function test_store_requires_title(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();

        $this->actingAs($user)->postJson("/api/projects/{$project->id}/tasks", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('title');
    }

    public function test_store_denies_creating_task_for_other_users_project(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner)->create();
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->postJson("/api/projects/{$project->id}/tasks", ['title' => 'x'])
            ->assertForbidden();
    }

    public function test_update_partially_updates_only_provided_fields(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create([
            'title' => 'Original',
            'short_description' => 'Descrição original',
        ]);

        $response = $this->actingAs($user)->patchJson("/api/tasks/{$task->id}", [
            'title' => 'Atualizado',
        ]);

        $response->assertOk()->assertJsonPath('task.title', 'Atualizado');
        $this->assertSame('Descrição original', $task->fresh()->short_description);
    }

    public function test_update_changes_status(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();

        $response = $this->actingAs($user)->patchJson("/api/tasks/{$task->id}", [
            'status' => TaskStatus::InProgress->value,
        ]);

        $response->assertOk()->assertJsonPath('task.status', TaskStatus::InProgress->value);
    }

    public function test_update_syncs_tags_replacing_previous_set(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();
        $task->tags()->attach(Tag::factory()->for($user)->create(['name' => 'Antiga']));

        $response = $this->actingAs($user)->patchJson("/api/tasks/{$task->id}", [
            'tags' => ['Nova'],
        ]);

        $response->assertOk();
        $this->assertSame(['Nova'], $task->fresh()->tags->pluck('name')->all());
    }

    public function test_update_denies_other_users_task(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner)->create();
        $task = Task::factory()->for($project)->create();
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->patchJson("/api/tasks/{$task->id}", ['title' => 'x'])
            ->assertForbidden();
    }

    public function test_destroy_deletes_task_and_cascades_attachments(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();

        $this->actingAs($user)->deleteJson("/api/tasks/{$task->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_destroy_removes_attachment_files_from_disk(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();
        $path = UploadedFile::fake()->create('a.png', 10, 'image/png')->store('attachments/'.$task->id, 'public');
        Attachment::factory()->for($task)->create(['path' => $path]);

        $this->actingAs($user)->deleteJson("/api/tasks/{$task->id}")->assertNoContent();

        Storage::disk('public')->assertMissing($path);
    }

    public function test_destroy_denies_other_users_task(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner)->create();
        $task = Task::factory()->for($project)->create();
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->deleteJson("/api/tasks/{$task->id}")
            ->assertForbidden();
    }

    public function test_endpoints_require_authentication(): void
    {
        $project = Project::factory()->create();
        $task = Task::factory()->for($project)->create();

        $this->getJson("/api/projects/{$project->id}/tasks")->assertUnauthorized();
        $this->patchJson("/api/tasks/{$task->id}", ['title' => 'x'])->assertUnauthorized();
    }
}
