<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAuthenticated
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->session()->has('userId')) {
            return response()->json(['error' => 'Authentication required'], 401);
        }
        return $next($request);
    }
}
