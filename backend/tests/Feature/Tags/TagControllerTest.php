<?php

namespace Tests\Feature\Tags;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TagControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_only_authenticated_users_tags_sorted(): void
    {
        $user = User::factory()->create();
        Tag::factory()->for($user)->create(['name' => 'UX']);
        Tag::factory()->for($user)->create(['name' => 'Design']);
        Tag::factory()->create(['name' => 'De outro usuário']);

        $response = $this->actingAs($user)->getJson('/api/tags');

        $response->assertOk()->assertJson(['tags' => ['Design', 'UX']]);
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson('/api/tags')->assertUnauthorized();
    }
}
