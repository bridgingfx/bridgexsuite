<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSuperAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->session()->get('userRole') !== 'super_admin') {
            return response()->json(['error' => 'Super admin access required'], 403);
        }
        return $next($request);
    }
}
