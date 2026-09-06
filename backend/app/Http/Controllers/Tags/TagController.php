<?php

namespace App\Http\Controllers\Tags;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tags = $request->user()->tags()->orderBy('name')->pluck('name');

        return response()->json([
            'tags' => $tags,
        ]);
    }
}
