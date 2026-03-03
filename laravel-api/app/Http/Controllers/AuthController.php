<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string|min:1',
            ]);

            $user = User::where('email', $validated['email'])->first();
            if (!$user) {
                return response()->json(['error' => 'Invalid email or password'], 401);
            }

            $passwordHash = str_replace('$2b$', '$2y$', $user->password);
            if (!Hash::check($validated['password'], $passwordHash)) {
                return response()->json(['error' => 'Invalid email or password'], 401);
            }

            $request->session()->put('userId', $user->id);
            $request->session()->put('userRole', $user->role);

            return response()->json($user->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json(['error' => 'Login failed'], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->session()->flush();
        $cookie = cookie()->forget('laravel_session');
        return response()->json(['message' => 'Logged out'])->withCookie($cookie);
    }

    public function me(Request $request)
    {
        $userId = $request->session()->get('userId');
        if (!$userId) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 401);
        }

        return response()->json($user->toArray());
    }
}
