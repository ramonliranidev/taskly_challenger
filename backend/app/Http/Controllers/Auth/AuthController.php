<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registra um novo usuário e retorna um token de acesso.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->lower()->toString(),
            'password' => Hash::make($request->string('password')->toString()),
        ]);

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'user' => $user->only('id', 'name', 'email'),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Autentica o usuário por e-mail/senha e retorna um token de acesso.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->string('email')->lower()->toString())->first();

        if (! $user || ! Hash::check($request->string('password')->toString(), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais informadas estão incorretas.'],
            ]);
        }

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'user' => $user->only('id', 'name', 'email'),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Revoga o token usado na requisição atual.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }

    /**
     * Retorna o usuário autenticado.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->only('id', 'name', 'email'),
        ]);
    }
}
