<?php

namespace App\Http\Controllers;

use App\Models\IbReferral;
use App\Models\Commission;
use Illuminate\Http\Request;

class IbController extends Controller
{
    public function referrals()
    {
        try {
            $refs = IbReferral::orderByDesc('created_at')->get();
            return response()->json($refs->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch referrals'], 500);
        }
    }

    public function storeReferral(Request $request)
    {
        try {
            $validated = $request->validate([
                'ibUserId' => 'required|string',
                'referredUserId' => 'required|string',
                'commission' => 'sometimes|string',
                'level' => 'sometimes|integer',
            ]);

            $ref = IbReferral::create([
                'ib_user_id' => $validated['ibUserId'],
                'referred_user_id' => $validated['referredUserId'],
                'commission' => $validated['commission'] ?? '0',
                'level' => $validated['level'] ?? 1,
                'status' => 'active',
            ]);

            return response()->json($ref->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create referral'], 400);
        }
    }

    public function commissions()
    {
        try {
            $comms = Commission::orderByDesc('created_at')->get();
            return response()->json($comms->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch commissions'], 500);
        }
    }
}
