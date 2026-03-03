<?php

namespace App\Http\Controllers;

use App\Models\PropChallenge;
use App\Models\PropAccount;
use App\Models\InvestmentPlan;
use App\Models\Investment;
use App\Models\SignalProvider;
use App\Models\CopyRelationship;
use App\Models\PammManager;
use App\Models\PammInvestment;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function propChallenges()
    {
        try {
            return response()->json(PropChallenge::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch challenges'], 500);
        }
    }

    public function propAccounts(Request $request)
    {
        try {
            $accounts = PropAccount::where('user_id', $request->session()->get('userId'))
                ->orderByDesc('created_at')->get();
            return response()->json($accounts->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch prop accounts'], 500);
        }
    }

    public function createPropAccount(Request $request)
    {
        try {
            $validated = $request->validate(['challengeId' => 'required|string']);
            $challenge = PropChallenge::find($validated['challengeId']);
            if (!$challenge) return response()->json(['error' => 'Challenge not found'], 404);

            $accountNumber = 'PROP' . rand(10000000, 99999999);
            $account = PropAccount::create([
                'user_id' => $request->session()->get('userId'),
                'challenge_id' => $validated['challengeId'],
                'account_number' => $accountNumber,
                'current_balance' => $challenge->account_size,
                'status' => 'active',
            ]);

            return response()->json($account->toArray(), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create prop account'], 500);
        }
    }

    public function investmentPlans()
    {
        try {
            return response()->json(InvestmentPlan::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch investment plans'], 500);
        }
    }

    public function investments(Request $request)
    {
        try {
            $investments = Investment::where('user_id', $request->session()->get('userId'))
                ->orderByDesc('created_at')->get();
            return response()->json($investments->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch investments'], 500);
        }
    }

    public function createInvestment(Request $request)
    {
        try {
            $validated = $request->validate([
                'planId' => 'required|string',
                'amount' => 'required|string',
            ]);

            $plan = InvestmentPlan::find($validated['planId']);
            if (!$plan) return response()->json(['error' => 'Plan not found'], 404);

            $maturityDate = now()->addDays($plan->duration_days);

            $investment = Investment::create([
                'user_id' => $request->session()->get('userId'),
                'plan_id' => $validated['planId'],
                'amount' => $validated['amount'],
                'current_value' => $validated['amount'],
                'start_date' => now(),
                'maturity_date' => $maturityDate,
            ]);

            return response()->json($investment->toArray(), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create investment'], 500);
        }
    }

    public function copyProviders()
    {
        try {
            return response()->json(SignalProvider::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch signal providers'], 500);
        }
    }

    public function copyRelationships(Request $request)
    {
        try {
            $rels = CopyRelationship::where('follower_id', $request->session()->get('userId'))
                ->orderByDesc('created_at')->get();
            return response()->json($rels->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch copy relationships'], 500);
        }
    }

    public function createCopyRelationship(Request $request)
    {
        try {
            $validated = $request->validate([
                'providerId' => 'required|string',
                'allocatedAmount' => 'required|string',
            ]);

            $provider = SignalProvider::find($validated['providerId']);
            if (!$provider) return response()->json(['error' => 'Provider not found'], 404);

            $rel = CopyRelationship::create([
                'follower_id' => $request->session()->get('userId'),
                'provider_id' => $validated['providerId'],
                'allocated_amount' => $validated['allocatedAmount'],
            ]);

            return response()->json($rel->toArray(), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create copy relationship'], 500);
        }
    }

    public function updateCopyRelationship(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['status' => 'required|string']);

            $userId = $request->session()->get('userId');
            $rel = CopyRelationship::where('id', $id)->where('follower_id', $userId)->first();
            if (!$rel) return response()->json(['error' => 'Not authorized'], 403);

            $rel->update(['status' => $validated['status']]);
            return response()->json($rel->fresh()->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update relationship'], 500);
        }
    }

    public function pammManagers()
    {
        try {
            return response()->json(PammManager::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch PAMM managers'], 500);
        }
    }

    public function pammInvestments(Request $request)
    {
        try {
            $investments = PammInvestment::where('investor_id', $request->session()->get('userId'))
                ->orderByDesc('created_at')->get();
            return response()->json($investments->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch PAMM investments'], 500);
        }
    }

    public function createPammInvestment(Request $request)
    {
        try {
            $validated = $request->validate([
                'managerId' => 'required|string',
                'amount' => 'required|string',
            ]);

            $manager = PammManager::find($validated['managerId']);
            if (!$manager) return response()->json(['error' => 'Manager not found'], 404);

            $investment = PammInvestment::create([
                'investor_id' => $request->session()->get('userId'),
                'manager_id' => $validated['managerId'],
                'amount' => $validated['amount'],
                'current_value' => $validated['amount'],
            ]);

            return response()->json($investment->toArray(), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create PAMM investment'], 500);
        }
    }
}
