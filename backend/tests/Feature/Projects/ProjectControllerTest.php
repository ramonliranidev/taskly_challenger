<?php

namespace Tests\Feature\Projects;

use App\Models\Attachment;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_only_authenticated_users_projects(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        Task::factory()->count(2)->for($project)->create();
        Project::factory()->create(); // de outro usuário

        $response = $this->actingAs($user)->getJson('/api/projects');

        $response->assertOk()
            ->assertJsonCount(1, 'projects')
            ->assertJsonPath('projects.0.id', $project->id)
            ->assertJsonPath('projects.0.tasks_count', 2);
    }

    public function test_store_creates_project_for_authenticated_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/projects', [
            'name' => 'Website redesign',
        ]);

        $response->assertCreated()
            ->assertJsonPath('project.name', 'Website redesign');

        $this->assertDatabaseHas('projects', [
            'user_id' => $user->id,
            'name' => 'Website redesign',
        ]);
    }

    public function test_store_requires_name(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/projects', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_show_denies_other_users_project(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner)->create();
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->getJson("/api/projects/{$project->id}")
            ->assertForbidden();
    }

    public function test_update_renames_project(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create(['name' => 'Antigo']);

        $response = $this->actingAs($user)->patchJson("/api/projects/{$project->id}", [
            'name' => 'Novo nome',
        ]);

        $response->assertOk()->assertJsonPath('project.name', 'Novo nome');
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Novo nome']);
    }

    public function test_update_denies_other_users_project(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner)->create();
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->patchJson("/api/projects/{$project->id}", ['name' => 'x'])
            ->assertForbidden();
    }

    public function test_destroy_deletes_project_and_cascades_tasks(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();

        $this->actingAs($user)->deleteJson("/api/projects/{$project->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
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

        $this->actingAs($user)->deleteJson("/api/projects/{$project->id}")->assertNoContent();

        Storage::disk('public')->assertMissing($path);
    }

    public function test_destroy_denies_other_users_project(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner)->create();
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->deleteJson("/api/projects/{$project->id}")
            ->assertForbidden();
    }

    public function test_endpoints_require_authentication(): void
    {
        $this->getJson('/api/projects')->assertUnauthorized();
        $this->postJson('/api/projects', ['name' => 'x'])->assertUnauthorized();
    }
}
