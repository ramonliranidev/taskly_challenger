<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Attachment;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $projects = $request->user()->projects()->withCount('tasks')->oldest()->get();

        return response()->json([
            'projects' => ProjectResource::collection($projects),
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $this->authorize('create', Project::class);

        $project = $request->user()->projects()->create($request->validated());

        return response()->json([
            'project' => new ProjectResource($project),
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json([
            'project' => new ProjectResource($project->loadCount('tasks')),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return response()->json([
            'project' => new ProjectResource($project->loadCount('tasks')),
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        foreach ($project->tasks()->with('attachments')->get() as $task) {
            Attachment::purgeFiles($task->attachments);
        }
        $project->delete();

        return response()->json(status: 204);
    }
}
