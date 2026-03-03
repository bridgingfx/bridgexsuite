<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $txns = Transaction::where('user_id', $request->session()->get('userId'))
                ->orderByDesc('created_at')
                ->get();
            return response()->json($txns->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch transactions'], 500);
        }
    }

    public function recent(Request $request)
    {
        try {
            $txns = Transaction::where('user_id', $request->session()->get('userId'))
                ->orderByDesc('created_at')
                ->limit(5)
                ->get();
            return response()->json($txns->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch recent transactions'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|in:deposit,withdrawal',
                'amount' => 'required|string|min:1',
                'currency' => 'sometimes|string',
                'method' => 'sometimes|string',
                'notes' => 'sometimes|string',
            ]);

            $txn = Transaction::create([
                'user_id' => $request->session()->get('userId'),
                'type' => $validated['type'],
                'amount' => $validated['amount'],
                'currency' => $validated['currency'] ?? 'USD',
                'method' => $validated['method'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'pending',
            ]);

            return response()->json($txn->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create transaction'], 400);
        }
    }

    public function walletTransfer(Request $request)
    {
        try {
            $validated = $request->validate([
                'recipientEmail' => 'required|email',
                'amount' => 'required|string|min:1',
                'message' => 'sometimes|string',
            ]);

            $numAmount = (float) $validated['amount'];
            if ($numAmount <= 0) return response()->json(['error' => 'Invalid amount'], 400);

            $userId = $request->session()->get('userId');
            $sender = User::find($userId);
            if (!$sender) return response()->json(['error' => 'Sender not found'], 404);

            if (strtolower($validated['recipientEmail']) === strtolower($sender->email)) {
                return response()->json(['error' => 'Cannot transfer to yourself'], 400);
            }

            $recipient = User::where('email', $validated['recipientEmail'])->first();
            if (!$recipient) {
                return response()->json(['error' => 'Recipient not found. Please check the email address.'], 404);
            }

            $userTxns = Transaction::where('user_id', $userId)->get();
            $totalDeposits = $userTxns->filter(fn($t) => $t->type === 'deposit' && in_array($t->status, ['approved', 'completed']))
                ->sum(fn($t) => (float) $t->amount);
            $totalWithdrawals = $userTxns->filter(fn($t) => $t->type === 'withdrawal' && in_array($t->status, ['approved', 'completed']))
                ->sum(fn($t) => (float) $t->amount);
            $walletBalance = $totalDeposits - $totalWithdrawals;

            if ($numAmount > $walletBalance) {
                return response()->json(['error' => "Insufficient wallet balance. Available: \$" . number_format($walletBalance, 2)], 400);
            }

            $msg = $validated['message'] ?? null;
            $noteText = $msg
                ? "Wallet transfer to {$validated['recipientEmail']}: {$msg}"
                : "Wallet transfer to {$validated['recipientEmail']}";

            Transaction::create([
                'user_id' => $userId,
                'type' => 'withdrawal',
                'amount' => $validated['amount'],
                'currency' => 'USD',
                'method' => 'wallet_transfer',
                'notes' => $noteText,
                'status' => 'approved',
            ]);

            Transaction::create([
                'user_id' => $recipient->id,
                'type' => 'deposit',
                'amount' => $validated['amount'],
                'currency' => 'USD',
                'method' => 'wallet_transfer',
                'notes' => "Wallet transfer from {$sender->email}" . ($msg ? ": {$msg}" : ""),
                'status' => 'approved',
            ]);

            return response()->json([
                'success' => true,
                'message' => "\$" . number_format($numAmount, 2) . " transferred to {$validated['recipientEmail']}",
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Transfer failed'], 500);
        }
    }

    public function updateStatus(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['status' => 'required|string']);
            $txn = Transaction::find($id);
            if (!$txn) return response()->json(['error' => 'Transaction not found'], 404);
            $txn->update(['status' => $validated['status']]);
            return response()->json($txn->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update transaction'], 400);
        }
    }

    public function cancel(Request $request, string $id)
    {
        try {
            $txn = Transaction::find($id);
            if (!$txn) return response()->json(['error' => 'Transaction not found'], 404);
            if ($txn->user_id !== $request->session()->get('userId')) {
                return response()->json(['error' => 'Not authorized'], 403);
            }
            if ($txn->status !== 'pending') {
                return response()->json(['error' => 'Only pending transactions can be cancelled'], 400);
            }
            $txn->update(['status' => 'cancelled']);
            return response()->json($txn->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to cancel transaction'], 400);
        }
    }

    public function commissionTransfer(Request $request)
    {
        try {
            $userId = $request->session()->get('userId');
            $userCommissions = \App\Models\Commission::where('user_id', $userId)->get();
            $paidCommissions = $userCommissions->where('status', 'paid');
            $totalAvailable = $paidCommissions->sum(fn($c) => (float) $c->amount);

            if ($totalAvailable <= 0) {
                return response()->json(['error' => 'No commission balance available to transfer'], 400);
            }

            $requestedAmount = $request->input('amount') ? (float) $request->input('amount') : $totalAvailable;
            if ($requestedAmount <= 0) {
                return response()->json(['error' => 'Invalid transfer amount'], 400);
            }
            if ($requestedAmount > $totalAvailable) {
                return response()->json(['error' => "Amount exceeds available commission balance (\$" . number_format($totalAvailable, 2) . ")"], 400);
            }

            $transferAmount = min($requestedAmount, $totalAvailable);

            Transaction::create([
                'user_id' => $userId,
                'type' => 'deposit',
                'amount' => number_format($transferAmount, 2, '.', ''),
                'currency' => 'USD',
                'method' => 'commission_transfer',
                'notes' => "Commission transfer to wallet (\$" . number_format($transferAmount, 2) . ")",
                'status' => 'approved',
            ]);

            $remaining = $transferAmount;
            foreach ($paidCommissions as $comm) {
                if ($remaining <= 0) break;
                $commAmt = (float) $comm->amount;
                if ($commAmt <= $remaining) {
                    $comm->update(['status' => 'transferred']);
                    $remaining -= $commAmt;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "\$" . number_format($transferAmount, 2) . " commission transferred to wallet",
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Commission transfer failed'], 500);
        }
    }
}
