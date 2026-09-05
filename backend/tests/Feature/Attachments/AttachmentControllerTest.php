<?php

namespace Tests\Feature\Attachments;

use App\Models\Attachment;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AttachmentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_uploads_files_and_creates_attachments(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();

        $file = UploadedFile::fake()->create('briefing.pdf', 100, 'application/pdf');

        $response = $this->actingAs($user)->postJson("/api/tasks/{$task->id}/attachments", [
            'files' => [$file],
        ]);

        $response->assertCreated()
            ->assertJsonCount(1, 'attachments')
            ->assertJsonPath('attachments.0.name', 'briefing.pdf')
            ->assertJsonPath('attachments.0.kind', 'PDF');

        $attachment = Attachment::first();
        Storage::disk('public')->assertExists($attachment->path);
    }

    public function test_store_rejects_invalid_mime_type(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();

        $file = UploadedFile::fake()->create('malware.exe', 10, 'application/x-msdownload');

        $this->actingAs($user)->postJson("/api/tasks/{$task->id}/attachments", ['files' => [$file]])
            ->assertStatus(422)
            ->assertJsonValidationErrors('files.0');
    }

    public function test_store_rejects_file_over_10mb(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();

        $file = UploadedFile::fake()->create('grande.png', 10241, 'image/png');

        $this->actingAs($user)->postJson("/api/tasks/{$task->id}/attachments", ['files' => [$file]])
            ->assertStatus(422)
            ->assertJsonValidationErrors('files.0');
    }

    public function test_store_denies_other_users_task(): void
    {
        Storage::fake('public');
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner)->create();
        $task = Task::factory()->for($project)->create();
        $intruder = User::factory()->create();

        $file = UploadedFile::fake()->create('a.png', 10, 'image/png');

        $this->actingAs($intruder)->postJson("/api/tasks/{$task->id}/attachments", ['files' => [$file]])
            ->assertForbidden();
    }

    public function test_destroy_deletes_file_from_disk_and_row(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $project = Project::factory()->for($user)->create();
        $task = Task::factory()->for($project)->create();
        $path = UploadedFile::fake()->create('a.png', 10, 'image/png')->store('attachments/'.$task->id, 'public');
        $attachment = Attachment::factory()->for($task)->create(['path' => $path]);

        $this->actingAs($user)->deleteJson("/api/attachments/{$attachment->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('attachments', ['id' => $attachment->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_destroy_denies_other_users_attachment(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->for($owner)->create();
        $task = Task::factory()->for($project)->create();
        $attachment = Attachment::factory()->for($task)->create();
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->deleteJson("/api/attachments/{$attachment->id}")
            ->assertForbidden();
    }

    public function test_endpoints_require_authentication(): void
    {
        $project = Project::factory()->create();
        $task = Task::factory()->for($project)->create();

        $this->postJson("/api/tasks/{$task->id}/attachments", [])->assertUnauthorized();
    }
}
