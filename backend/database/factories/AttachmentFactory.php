<?php

namespace Database\Factories;

use App\Models\Attachment;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attachment>
 */
class AttachmentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->word().'.png';

        return [
            'task_id' => Task::factory(),
            'disk' => 'public',
            'path' => 'attachments/'.fake()->uuid().'/'.$name,
            'original_name' => $name,
            'mime_type' => 'image/png',
            'size' => fake()->numberBetween(1_000, 500_000),
        ];
    }
}
