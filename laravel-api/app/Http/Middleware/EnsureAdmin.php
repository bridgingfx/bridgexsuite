<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $role = $request->session()->get('userRole');
        if ($role !== 'admin' && $role !== 'super_admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }
        return $next($request);
    }
}
