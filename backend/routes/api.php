<?php

use App\Http\Controllers\Attachments\AttachmentController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Projects\ProjectController;
use App\Http\Controllers\Tags\TagController;
use App\Http\Controllers\Tasks\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rotas da API REST consumida pela SPA Angular. Todas as respostas são
| JSON. A autenticação usa tokens do Laravel Sanctum (Bearer token).
|
*/

Route::post('register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('projects.tasks', TaskController::class)->shallow();
    Route::post('tasks/{task}/attachments', [AttachmentController::class, 'store']);
    Route::delete('attachments/{attachment}', [AttachmentController::class, 'destroy']);
    Route::get('tags', [TagController::class, 'index']);
});
