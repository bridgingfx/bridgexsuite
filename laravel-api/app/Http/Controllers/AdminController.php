<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TradingAccount;
use App\Models\Transaction;
use App\Models\KycDocument;
use App\Models\SupportTicket;
use App\Models\TicketReply;
use App\Models\IbReferral;
use App\Models\Commission;
use App\Models\CommissionTier;
use App\Models\BrokerSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        try {
            $allUsers = User::whereIn('role', ['client', 'ib', 'lead'])->orderByDesc('created_at')->get();
            $allTransactions = Transaction::orderByDesc('created_at')->get();
            $allAccounts = TradingAccount::all();
            $allTickets = SupportTicket::all();
            $allKyc = KycDocument::all();
            $allCommissions = Commission::all();
            $allReferrals = IbReferral::all();

            $totalClients = $allUsers->count();
            $activeClients = $allUsers->where('status', 'active')->count();
            $pendingKyc = $allKyc->where('status', 'pending')->count();
            $pendingTransactions = $allTransactions->where('status', 'pending')->count();
            $pendingWithdrawals = $allTransactions->filter(fn($t) => $t->type === 'withdrawal' && $t->status === 'pending')->count();
            $pendingDeposits = $allTransactions->filter(fn($t) => $t->type === 'deposit' && $t->status === 'pending')->count();
            $totalDeposits = $allTransactions->filter(fn($t) => $t->type === 'deposit' && $t->status === 'completed')
                ->sum(fn($t) => (float) $t->amount);
            $totalWithdrawals = $allTransactions->filter(fn($t) => $t->type === 'withdrawal' && $t->status === 'completed')
                ->sum(fn($t) => (float) $t->amount);
            $totalCommissionsAmount = $allCommissions->sum(fn($c) => (float) $c->amount);
            $openTickets = $allTickets->whereIn('status', ['open', 'in_progress'])->count();
            $totalAccountBalance = $allAccounts->sum(fn($a) => (float) $a->balance);

            return response()->json([
                'totalClients' => $totalClients,
                'activeClients' => $activeClients,
                'pendingKyc' => $pendingKyc,
                'pendingTransactions' => $pendingTransactions,
                'pendingWithdrawals' => $pendingWithdrawals,
                'pendingDeposits' => $pendingDeposits,
                'totalDeposits' => $totalDeposits,
                'totalWithdrawals' => $totalWithdrawals,
                'netDeposits' => $totalDeposits - $totalWithdrawals,
                'totalCommissions' => $totalCommissionsAmount,
                'openTickets' => $openTickets,
                'totalAccounts' => $allAccounts->count(),
                'activeAccounts' => $allAccounts->where('status', 'active')->count(),
                'totalAccountBalance' => $totalAccountBalance,
                'totalReferrals' => $allReferrals->count(),
                'activeIBs' => $allUsers->filter(fn($u) => $u->role === 'ib' && $u->status === 'active')->count(),
                'recentTransactions' => $allTransactions->take(10)->toArray(),
                'recentClients' => $allUsers->take(5)->toArray(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch admin dashboard stats'], 500);
        }
    }

    public function clients()
    {
        try {
            $clients = User::whereIn('role', ['client', 'ib', 'lead'])->orderByDesc('created_at')->get();
            return response()->json($clients->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch clients'], 500);
        }
    }

    public function clientDetail(string $id)
    {
        try {
            $client = User::find($id);
            if (!$client) return response()->json(['error' => 'Client not found'], 404);
            $accounts = TradingAccount::where('user_id', $id)->get();
            $txns = Transaction::where('user_id', $id)->orderByDesc('created_at')->get();
            $kyc = KycDocument::where('user_id', $id)->get();
            $tickets = SupportTicket::where('user_id', $id)->get();

            return response()->json([
                'client' => $client->toArray(),
                'accounts' => $accounts->toArray(),
                'transactions' => $txns->toArray(),
                'kycDocuments' => $kyc->toArray(),
                'tickets' => $tickets->toArray(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch client details'], 500);
        }
    }

    public function updateClient(Request $request, string $id)
    {
        try {
            $client = User::find($id);
            if (!$client) return response()->json(['error' => 'Client not found'], 404);
            $client->update($request->only([
                'username', 'full_name', 'email', 'phone', 'role',
                'status', 'kyc_status', 'country', 'avatar',
            ]));
            return response()->json($client->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update client'], 400);
        }
    }

    public function updateClientStatus(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['status' => 'required|string']);
            $client = User::find($id);
            if (!$client) return response()->json(['error' => 'Client not found'], 404);
            $client->update(['status' => $validated['status']]);
            return response()->json($client->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update client status'], 400);
        }
    }

    public function updateClientKycStatus(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['kycStatus' => 'required|string']);
            $client = User::find($id);
            if (!$client) return response()->json(['error' => 'Client not found'], 404);
            $client->update(['kyc_status' => $validated['kycStatus']]);
            return response()->json($client->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update KYC status'], 400);
        }
    }

    public function tradingAccounts()
    {
        try {
            return response()->json(TradingAccount::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch trading accounts'], 500);
        }
    }

    public function createTradingAccount(Request $request)
    {
        try {
            $validated = $request->validate([
                'userId' => 'required|string',
                'platform' => 'sometimes|string',
                'type' => 'sometimes|string',
                'leverage' => 'sometimes|string',
                'currency' => 'sometimes|string',
                'balance' => 'sometimes|string',
                'equity' => 'sometimes|string',
            ]);

            $account = TradingAccount::create([
                'user_id' => $validated['userId'],
                'platform' => $validated['platform'] ?? 'MT5',
                'type' => $validated['type'] ?? 'standard',
                'leverage' => $validated['leverage'] ?? '1:100',
                'currency' => $validated['currency'] ?? 'USD',
                'balance' => $validated['balance'] ?? '0',
                'equity' => $validated['equity'] ?? '0',
                'account_number' => '',
                'status' => 'active',
            ]);

            return response()->json($account->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create account'], 400);
        }
    }

    public function updateTradingAccount(Request $request, string $id)
    {
        try {
            $account = TradingAccount::find($id);
            if (!$account) return response()->json(['error' => 'Account not found'], 404);
            $account->update($request->only(['platform', 'type', 'leverage', 'balance', 'equity', 'currency', 'status']));
            return response()->json($account->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update account'], 400);
        }
    }

    public function transactions()
    {
        try {
            return response()->json(Transaction::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch transactions'], 500);
        }
    }

    public function pendingTransactions()
    {
        try {
            return response()->json(Transaction::where('status', 'pending')->orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch pending transactions'], 500);
        }
    }

    public function approveTransaction(Request $request, string $id)
    {
        try {
            $approvedBy = $request->input('approvedBy', 'admin');
            $txn = Transaction::find($id);
            if (!$txn) return response()->json(['error' => 'Transaction not found'], 404);
            $txn->update([
                'status' => 'approved',
                'approved_by' => $approvedBy,
                'processed_at' => now(),
            ]);
            return response()->json($txn->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to approve transaction'], 400);
        }
    }

    public function rejectTransaction(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['reason' => 'required|string|min:1']);
            $txn = Transaction::find($id);
            if (!$txn) return response()->json(['error' => 'Transaction not found'], 404);
            $txn->update([
                'status' => 'rejected',
                'rejection_reason' => $validated['reason'],
                'processed_at' => now(),
            ]);
            return response()->json($txn->fresh()->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reject transaction'], 400);
        }
    }

    public function kycDocuments()
    {
        try {
            return response()->json(KycDocument::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch KYC documents'], 500);
        }
    }

    public function pendingKycDocuments()
    {
        try {
            return response()->json(KycDocument::where('status', 'pending')->orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch pending KYC documents'], 500);
        }
    }

    public function reviewKycDocument(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:approved,rejected',
                'reviewedBy' => 'sometimes|string',
                'notes' => 'sometimes|string',
            ]);

            $doc = KycDocument::find($id);
            if (!$doc) return response()->json(['error' => 'Document not found'], 404);

            $doc->update([
                'status' => $validated['status'],
                'reviewed_by' => $validated['reviewedBy'] ?? 'admin',
                'reviewed_at' => now(),
                'notes' => $validated['notes'] ?? $doc->notes,
            ]);

            return response()->json($doc->fresh()->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to review document'], 400);
        }
    }

    public function ibReferrals()
    {
        try {
            return response()->json(IbReferral::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch referrals'], 500);
        }
    }

    public function commissions()
    {
        try {
            return response()->json(Commission::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch commissions'], 500);
        }
    }

    public function commissionTiers()
    {
        try {
            return response()->json(CommissionTier::orderBy('level')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch commission tiers'], 500);
        }
    }

    public function createCommissionTier(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:1',
                'level' => 'required|integer',
                'commissionRate' => 'required|string',
                'minVolume' => 'sometimes|string',
                'maxVolume' => 'sometimes|nullable|string',
            ]);

            $tier = CommissionTier::create([
                'name' => $validated['name'],
                'level' => $validated['level'],
                'commission_rate' => $validated['commissionRate'],
                'min_volume' => $validated['minVolume'] ?? '0',
                'max_volume' => $validated['maxVolume'] ?? null,
            ]);

            return response()->json($tier->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create tier'], 400);
        }
    }

    public function supportTickets()
    {
        try {
            return response()->json(SupportTicket::orderByDesc('created_at')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch tickets'], 500);
        }
    }

    public function updateTicketStatus(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['status' => 'required|string']);
            $ticket = SupportTicket::find($id);
            if (!$ticket) return response()->json(['error' => 'Ticket not found'], 404);
            $ticket->update(['status' => $validated['status']]);
            return response()->json($ticket->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update ticket status'], 400);
        }
    }

    public function assignTicket(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['assignedTo' => 'required|string']);
            $ticket = SupportTicket::find($id);
            if (!$ticket) return response()->json(['error' => 'Ticket not found'], 404);
            $ticket->update(['assigned_to' => $validated['assignedTo']]);
            return response()->json($ticket->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to assign ticket'], 400);
        }
    }

    public function replyToTicket(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'userId' => 'required|string',
                'message' => 'required|string|min:1',
            ]);

            $reply = TicketReply::create([
                'ticket_id' => $id,
                'user_id' => $validated['userId'],
                'message' => $validated['message'],
                'is_admin' => true,
            ]);

            return response()->json($reply->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create reply'], 400);
        }
    }

    public function settings()
    {
        try {
            return response()->json(BrokerSetting::orderBy('category')->get()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch settings'], 500);
        }
    }

    public function upsertSetting(Request $request)
    {
        try {
            $validated = $request->validate([
                'settingKey' => 'required|string|min:1',
                'settingValue' => 'required|string',
                'category' => 'sometimes|string',
                'description' => 'sometimes|string',
            ]);

            $setting = BrokerSetting::where('setting_key', $validated['settingKey'])->first();
            if ($setting) {
                $setting->update([
                    'setting_value' => $validated['settingValue'],
                    'category' => $validated['category'] ?? $setting->category,
                    'description' => $validated['description'] ?? $setting->description,
                ]);
                return response()->json($setting->fresh()->toArray());
            }

            $setting = BrokerSetting::create([
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
