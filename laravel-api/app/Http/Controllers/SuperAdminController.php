<?php

namespace App\Http\Controllers;

use App\Models\Broker;
use App\Models\SubscriptionPlan;
use App\Models\BrokerSubscription;
use App\Models\BrokerAdmin;
use App\Models\BrokerBranding;
use App\Models\PlatformSetting;
use App\Models\User;
use App\Models\Transaction;
use App\Models\TradingAccount;
use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    public function dashboardStats()
    {
        try {
            $allBrokers = Broker::orderByDesc('created_at')->get();
            $allPlans = SubscriptionPlan::orderBy('price')->get();
            $allSubs = BrokerSubscription::orderByDesc('created_at')->get();
            $allAdmins = BrokerAdmin::all();
            $allUsers = User::whereIn('role', ['client', 'ib', 'lead'])->get();
            $allTransactions = Transaction::all();
            $allAccounts = TradingAccount::all();

            $activeBrokers = $allBrokers->where('status', 'active')->count();
            $suspendedBrokers = $allBrokers->where('status', 'suspended')->count();
            $activeSubs = $allSubs->where('status', 'active');
            $mrr = $activeSubs->sum(function ($s) use ($allPlans) {
                $plan = $allPlans->firstWhere('id', $s->plan_id);
                return $plan ? (float) $plan->price : 0;
            });

            $totalDeposits = $allTransactions
                ->filter(fn($t) => $t->type === 'deposit' && $t->status === 'completed')
                ->sum(fn($t) => (float) $t->amount);

            return response()->json([
                'totalBrokers' => $allBrokers->count(),
                'activeBrokers' => $activeBrokers,
                'suspendedBrokers' => $suspendedBrokers,
                'totalPlans' => $allPlans->count(),
                'activeSubscriptions' => $activeSubs->count(),
                'mrr' => $mrr,
                'arr' => $mrr * 12,
                'totalAdminUsers' => $allAdmins->count(),
                'totalClients' => $allUsers->count(),
                'totalAccounts' => $allAccounts->count(),
                'totalTransactionVolume' => $totalDeposits,
                'recentBrokers' => $allBrokers->take(5)->toArray(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch super admin stats'], 500);
        }
    }

    public function brokers()
    {
        try {
            return response()->json(Broker::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch brokers'], 500);
        }
    }

    public function brokerDetail(string $id)
    {
        try {
            $broker = Broker::find($id);
            if (!$broker) return response()->json(['error' => 'Broker not found'], 404);
            $admins = BrokerAdmin::where('broker_id', $id)->orderByDesc('created_at')->get();
            $subs = BrokerSubscription::where('broker_id', $id)->orderByDesc('created_at')->get();
            $branding = BrokerBranding::where('broker_id', $id)->first();

            return response()->json([
                'broker' => $broker->toArray(),
                'admins' => $admins->toArray(),
                'subscriptions' => $subs->toArray(),
                'branding' => $branding ? $branding->toArray() : null,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch broker details'], 500);
        }
    }

    public function createBroker(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:1',
                'slug' => 'required|string|min:1',
                'email' => 'required|email',
                'phone' => 'sometimes|string',
                'companyName' => 'sometimes|string',
                'country' => 'sometimes|string',
                'status' => 'sometimes|string',
                'maxClients' => 'sometimes|integer',
                'maxAccounts' => 'sometimes|integer',
            ]);

            $broker = Broker::create([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'company_name' => $validated['companyName'] ?? null,
                'country' => $validated['country'] ?? null,
                'status' => $validated['status'] ?? 'active',
                'max_clients' => $validated['maxClients'] ?? 100,
                'max_accounts' => $validated['maxAccounts'] ?? 500,
            ]);

            return response()->json($broker->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create broker'], 400);
        }
    }

    public function updateBroker(Request $request, string $id)
    {
        try {
            $broker = Broker::find($id);
            if (!$broker) return response()->json(['error' => 'Broker not found'], 404);
            $data = $request->only(['name', 'slug', 'email', 'phone', 'country', 'status', 'max_clients', 'max_accounts']);
            if ($request->has('companyName')) $data['company_name'] = $request->input('companyName');
            if ($request->has('maxClients')) $data['max_clients'] = $request->input('maxClients');
            if ($request->has('maxAccounts')) $data['max_accounts'] = $request->input('maxAccounts');
            $broker->update($data);
            return response()->json($broker->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update broker'], 400);
        }
    }

    public function suspendBroker(string $id)
    {
        try {
            $broker = Broker::find($id);
            if (!$broker) return response()->json(['error' => 'Broker not found'], 404);
            $broker->update(['status' => 'suspended']);
            return response()->json($broker->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to suspend broker'], 400);
        }
    }

    public function activateBroker(string $id)
    {
        try {
            $broker = Broker::find($id);
            if (!$broker) return response()->json(['error' => 'Broker not found'], 404);
            $broker->update(['status' => 'active']);
            return response()->json($broker->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to activate broker'], 400);
        }
    }

    public function plans()
    {
        try {
            return response()->json(SubscriptionPlan::orderBy('price')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch plans'], 500);
        }
    }

    public function createPlan(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:1',
                'price' => 'required|string',
                'billingCycle' => 'sometimes|string',
                'maxClients' => 'sometimes|integer',
                'maxAccounts' => 'sometimes|integer',
                'maxIBs' => 'sometimes|integer',
                'features' => 'sometimes|string',
                'status' => 'sometimes|string',
            ]);

            $plan = SubscriptionPlan::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'billing_cycle' => $validated['billingCycle'] ?? 'monthly',
                'max_clients' => $validated['maxClients'] ?? 100,
                'max_accounts' => $validated['maxAccounts'] ?? 500,
                'max_ibs' => $validated['maxIBs'] ?? 50,
                'features' => $validated['features'] ?? null,
                'status' => $validated['status'] ?? 'active',
            ]);

            return response()->json($plan->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create plan'], 400);
        }
    }

    public function updatePlan(Request $request, string $id)
    {
        try {
            $plan = SubscriptionPlan::find($id);
            if (!$plan) return response()->json(['error' => 'Plan not found'], 404);
            $data = $request->only(['name', 'price', 'features', 'status']);
            if ($request->has('billingCycle')) $data['billing_cycle'] = $request->input('billingCycle');
            if ($request->has('maxClients')) $data['max_clients'] = $request->input('maxClients');
            if ($request->has('maxAccounts')) $data['max_accounts'] = $request->input('maxAccounts');
            if ($request->has('maxIBs')) $data['max_ibs'] = $request->input('maxIBs');
            $plan->update($data);
            return response()->json($plan->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update plan'], 400);
        }
    }

    public function subscriptions()
    {
        try {
            return response()->json(BrokerSubscription::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch subscriptions'], 500);
        }
    }

    public function createSubscription(Request $request)
    {
        try {
            $validated = $request->validate([
                'brokerId' => 'required|string',
                'planId' => 'required|string',
                'status' => 'sometimes|string',
            ]);

            $sub = BrokerSubscription::create([
                'broker_id' => $validated['brokerId'],
                'plan_id' => $validated['planId'],
                'status' => $validated['status'] ?? 'active',
            ]);

            return response()->json($sub->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create subscription'], 400);
        }
    }

    public function updateSubscription(Request $request, string $id)
    {
        try {
            $sub = BrokerSubscription::find($id);
            if (!$sub) return response()->json(['error' => 'Subscription not found'], 404);
            $sub->update($request->only(['status']));
            return response()->json($sub->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update subscription'], 400);
        }
    }

    public function admins()
    {
        try {
            return response()->json(BrokerAdmin::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch admins'], 500);
        }
    }

    public function brokerAdmins(string $id)
    {
        try {
            return response()->json(BrokerAdmin::where('broker_id', $id)->orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch broker admins'], 500);
        }
    }

    public function createAdmin(Request $request)
    {
        try {
            $validated = $request->validate([
                'brokerId' => 'required|string',
                'fullName' => 'required|string|min:1',
                'email' => 'required|email',
                'role' => 'sometimes|string',
                'status' => 'sometimes|string',
            ]);

            $admin = BrokerAdmin::create([
                'broker_id' => $validated['brokerId'],
                'full_name' => $validated['fullName'],
                'email' => $validated['email'],
                'role' => $validated['role'] ?? 'admin',
                'status' => $validated['status'] ?? 'active',
            ]);

            return response()->json($admin->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create admin'], 400);
        }
    }

    public function updateAdmin(Request $request, string $id)
    {
        try {
            $admin = BrokerAdmin::find($id);
            if (!$admin) return response()->json(['error' => 'Admin not found'], 404);
            $data = $request->only(['email', 'role', 'status']);
            if ($request->has('fullName')) $data['full_name'] = $request->input('fullName');
            $admin->update($data);
            return response()->json($admin->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update admin'], 400);
        }
    }

    public function getBranding(string $id)
    {
        try {
            $branding = BrokerBranding::where('broker_id', $id)->first();
            return response()->json($branding ? $branding->toArray() : (object) []);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch branding'], 500);
        }
    }

    public function updateBranding(Request $request, string $id)
    {
        try {
            $data = $request->only(['primary_color', 'secondary_color', 'accent_color', 'custom_domain', 'company_tagline', 'logo_url']);
            if ($request->has('primaryColor')) $data['primary_color'] = $request->input('primaryColor');
            if ($request->has('secondaryColor')) $data['secondary_color'] = $request->input('secondaryColor');
            if ($request->has('accentColor')) $data['accent_color'] = $request->input('accentColor');
            if ($request->has('customDomain')) $data['custom_domain'] = $request->input('customDomain');
            if ($request->has('companyTagline')) $data['company_tagline'] = $request->input('companyTagline');
            if ($request->has('logoUrl')) $data['logo_url'] = $request->input('logoUrl');

            $branding = BrokerBranding::where('broker_id', $id)->first();
            if ($branding) {
                $branding->update($data);
                return response()->json($branding->fresh()->toArray());
            }

            $data['broker_id'] = $id;
            $branding = BrokerBranding::create($data);
            return response()->json($branding->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update branding'], 400);
        }
    }

    public function platformSettings()
    {
        try {
            return response()->json(PlatformSetting::orderBy('category')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch platform settings'], 500);
        }
    }

    public function upsertPlatformSetting(Request $request)
    {
        try {
            $validated = $request->validate([
                'settingKey' => 'required|string|min:1',
                'settingValue' => 'required|string',
                'category' => 'sometimes|string',
                'description' => 'sometimes|string',
            ]);

            $setting = PlatformSetting::where('setting_key', $validated['settingKey'])->first();
            if ($setting) {
                $setting->update([
                    'setting_value' => $validated['settingValue'],
                    'category' => $validated['category'] ?? $setting->category,
                    'description' => $validated['description'] ?? $setting->description,
                ]);
                return response()->json($setting->fresh()->toArray());
            }

            $setting = PlatformSetting::create([
                'setting_key' => $validated['settingKey'],
                'setting_value' => $validated['settingValue'],
                'category' => $validated['category'] ?? 'general',
                'description' => $validated['description'] ?? null,
            ]);

            return response()->json($setting->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to save setting'], 400);
        }
    }
}
