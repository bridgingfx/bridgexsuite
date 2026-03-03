<?php

namespace App\Http\Controllers;

use App\Models\TradingAccount;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TradingAccountController extends Controller
{
    public function index(Request $request)
    {
        try {
            $accounts = TradingAccount::where('user_id', $request->session()->get('userId'))
                ->orderByDesc('created_at')
                ->get();
            return response()->json($accounts->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch trading accounts'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'platform' => 'sometimes|in:MT4,MT5,cTrader',
                'type' => 'sometimes|in:standard,ecn,demo,raw',
                'leverage' => 'sometimes|string',
                'currency' => 'sometimes|in:USD,EUR,GBP',
            ]);

            $account = TradingAccount::create([
                'user_id' => $request->session()->get('userId'),
                'platform' => $validated['platform'] ?? 'MT5',
                'type' => $validated['type'] ?? 'standard',
                'leverage' => $validated['leverage'] ?? '1:100',
                'currency' => $validated['currency'] ?? 'USD',
                'balance' => '0',
                'equity' => '0',
                'status' => 'active',
                'account_number' => '',
            ]);

            return response()->json($account->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create account'], 400);
        }
    }

    public function show(Request $request, string $id)
    {
        try {
            $account = TradingAccount::find($id);
            if (!$account) return response()->json(['error' => 'Account not found'], 404);
            if ($account->user_id !== $request->session()->get('userId')) {
                return response()->json(['error' => 'Not authorized'], 403);
            }

            $transactions = Transaction::where('user_id', $request->session()->get('userId'))
                ->where('account_id', $account->id)
                ->orderByDesc('created_at')
                ->get();

            return response()->json([
                'account' => $account->toArray(),
                'transactions' => $transactions->toArray(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch account details'], 500);
        }
    }

    public function internalTransfer(Request $request)
    {
        try {
            $validated = $request->validate([
                'fromAccountId' => 'required|string',
                'toAccountId' => 'required|string',
                'amount' => 'required|string',
            ]);

            $fromAcc = TradingAccount::find($validated['fromAccountId']);
            $toAcc = TradingAccount::find($validated['toAccountId']);
            if (!$fromAcc || !$toAcc) return response()->json(['error' => 'Account not found'], 404);

            $userId = $request->session()->get('userId');
            if ($fromAcc->user_id !== $userId || $toAcc->user_id !== $userId) {
                return response()->json(['error' => 'Not authorized'], 403);
            }
            if ($validated['fromAccountId'] === $validated['toAccountId']) {
                return response()->json(['error' => 'Cannot transfer to the same account'], 400);
            }

            $numAmount = (float) $validated['amount'];
            if ($numAmount <= 0) return response()->json(['error' => 'Invalid amount'], 400);

            $fromBalance = (float) $fromAcc->balance;
            if ($numAmount > $fromBalance) {
                return response()->json(['error' => 'Account does not have sufficient balance to Transfer'], 400);
            }

            $conversionRate = 1;
            if ($fromAcc->currency !== $toAcc->currency) {
                $rates = [
                    'USD' => ['EUR' => 0.92, 'GBP' => 0.79, 'JPY' => 149.5],
                    'EUR' => ['USD' => 1.09, 'GBP' => 0.86, 'JPY' => 162.5],
                    'GBP' => ['USD' => 1.27, 'EUR' => 1.16, 'JPY' => 189.0],
                    'JPY' => ['USD' => 0.0067, 'EUR' => 0.0062, 'GBP' => 0.0053],
                ];
                $conversionRate = $rates[$fromAcc->currency][$toAcc->currency] ?? 1.1;
            }

            $convertedAmount = $numAmount * $conversionRate;
            $rateNote = $fromAcc->currency !== $toAcc->currency
                ? " ({$fromAcc->currency}→{$toAcc->currency} @ " . number_format($conversionRate, 4) . ")"
                : "";

            $fromAcc->update([
                'balance' => number_format($fromBalance - $numAmount, 2, '.', ''),
                'equity' => number_format((float) $fromAcc->equity - $numAmount, 2, '.', ''),
            ]);

            $toAcc->update([
                'balance' => number_format((float) $toAcc->balance + $convertedAmount, 2, '.', ''),
                'equity' => number_format((float) $toAcc->equity + $convertedAmount, 2, '.', ''),
            ]);

            Transaction::create([
                'user_id' => $userId,
                'type' => 'withdrawal',
                'amount' => $validated['amount'],
                'currency' => $fromAcc->currency,
                'method' => 'internal_transfer',
                'notes' => "Internal transfer from {$fromAcc->account_number} to {$toAcc->account_number}{$rateNote}",
                'status' => 'approved',
            ]);

            Transaction::create([
                'user_id' => $userId,
                'type' => 'deposit',
                'amount' => number_format($convertedAmount, 2, '.', ''),
                'currency' => $toAcc->currency,
                'method' => 'internal_transfer',
                'notes' => "Internal transfer received from {$fromAcc->account_number} to {$toAcc->account_number}{$rateNote}",
                'status' => 'approved',
            ]);

            return response()->json([
                'success' => true,
                'conversionRate' => $conversionRate,
                'convertedAmount' => number_format($convertedAmount, 2, '.', ''),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Internal transfer failed'], 500);
        }
    }

    public function changePassword(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'newPassword' => 'required|string|min:6',
            ]);

            $account = TradingAccount::find($id);
            if (!$account) return response()->json(['error' => 'Account not found'], 404);
            if ($account->user_id !== $request->session()->get('userId')) {
                return response()->json(['error' => 'Not authorized'], 403);
            }

            return response()->json(['message' => 'Trading account password updated successfully']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to change password'], 500);
        }
    }

    public function changeLeverage(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['leverage' => 'required|string']);

            $account = TradingAccount::find($id);
            if (!$account) return response()->json(['error' => 'Account not found'], 404);
            if ($account->user_id !== $request->session()->get('userId')) {
                return response()->json(['error' => 'Not authorized'], 403);
            }

            $account->update(['leverage' => $validated['leverage']]);
            return response()->json($account->fresh()->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to change leverage'], 500);
        }
    }

    public function deposit(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['amount' => 'required|string|min:1']);

            $account = TradingAccount::find($id);
            if (!$account) return response()->json(['error' => 'Account not found'], 404);
            if ($account->user_id !== $request->session()->get('userId')) {
                return response()->json(['error' => 'Not authorized'], 403);
            }

            $numAmount = (float) $validated['amount'];
            if ($numAmount <= 0) return response()->json(['error' => 'Invalid amount'], 400);

            $userId = $request->session()->get('userId');
            $userTxns = Transaction::where('user_id', $userId)->get();
            $totalDeposits = $userTxns->filter(fn($t) => $t->type === 'deposit' && in_array($t->status, ['approved', 'completed']))
                ->sum(fn($t) => (float) $t->amount);
            $totalWithdrawals = $userTxns->filter(fn($t) => $t->type === 'withdrawal' && in_array($t->status, ['approved', 'completed']))
                ->sum(fn($t) => (float) $t->amount);
            $walletBalance = $totalDeposits - $totalWithdrawals;

            if ($numAmount > $walletBalance) {
                return response()->json(['error' => "Insufficient wallet balance. Available: \${$walletBalance}"], 400);
            }

            Transaction::create([
                'user_id' => $userId,
                'type' => 'withdrawal',
                'amount' => $validated['amount'],
                'currency' => $account->currency,
                'method' => 'wallet_transfer',
                'notes' => "Transfer to trading account {$account->account_number}",
                'status' => 'approved',
            ]);

            $creditTxn = Transaction::create([
                'user_id' => $userId,
                'account_id' => $account->id,
                'type' => 'deposit',
                'amount' => $validated['amount'],
                'currency' => $account->currency,
                'method' => 'wallet_transfer',
                'notes' => "Wallet transfer to {$account->account_number}",
                'status' => 'approved',
            ]);

            $newBalance = number_format((float) $account->balance + $numAmount, 2, '.', '');
            $newEquity = number_format((float) $account->equity + $numAmount, 2, '.', '');
            $account->update(['balance' => $newBalance, 'equity' => $newEquity]);

            return response()->json([
                'transaction' => $creditTxn->toArray(),
                'newBalance' => $newBalance,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to deposit to account'], 500);
        }
    }

    public function withdraw(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['amount' => 'required|string|min:1']);

            $account = TradingAccount::find($id);
            if (!$account) return response()->json(['error' => 'Account not found'], 404);
            if ($account->user_id !== $request->session()->get('userId')) {
                return response()->json(['error' => 'Not authorized'], 403);
            }

            $numAmount = (float) $validated['amount'];
            if ($numAmount <= 0) return response()->json(['error' => 'Invalid amount'], 400);

            $accBalance = (float) $account->balance;
            if ($numAmount > $accBalance) {
                return response()->json(['error' => "Insufficient balance. Available: \$" . number_format($accBalance, 2)], 400);
            }

            $userId = $request->session()->get('userId');

            Transaction::create([
                'user_id' => $userId,
                'type' => 'withdrawal',
                'amount' => $validated['amount'],
                'currency' => $account->currency,
                'method' => 'trading_withdrawal',
                'notes' => "Withdrawal from trading account {$account->account_number} to wallet",
                'status' => 'approved',
            ]);

            Transaction::create([
                'user_id' => $userId,
                'type' => 'deposit',
                'amount' => $validated['amount'],
                'currency' => $account->currency,
                'method' => 'trading_withdrawal',
                'notes' => "Wallet deposit from trading account {$account->account_number}",
                'status' => 'approved',
            ]);

            $newBalance = number_format($accBalance - $numAmount, 2, '.', '');
            $newEquity = number_format((float) $account->equity - $numAmount, 2, '.', '');
            $account->update(['balance' => $newBalance, 'equity' => $newEquity]);

            return response()->json(['success' => true, 'newBalance' => $newBalance]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to withdraw from account'], 500);
        }
    }
}
