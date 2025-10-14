<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckBanned
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->isBanned()) {
            Auth::logout();
            
            return redirect()->route('login')
                ->with('error', 'Your account has been banned. Reason: ' . (auth()->user()->ban_reason ?? 'No reason provided'));
        }

        return $next($request);
    }
}
