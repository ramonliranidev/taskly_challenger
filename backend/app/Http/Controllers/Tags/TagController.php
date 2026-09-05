<?php

namespace App\Http\Controllers\Tags;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Lista os nomes de tags já usadas pelo usuário autenticado, para
     * sugestão/autocomplete no diálogo de "+ Tag" do painel de edição.
     */
    public function index(Request $request): JsonResponse
    {
        $tags = $request->user()->tags()->orderBy('name')->pluck('name');

        return response()->json([
            'tags' => $tags,
        ]);
    }
}
