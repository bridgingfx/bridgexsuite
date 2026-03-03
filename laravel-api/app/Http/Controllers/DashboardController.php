<?php

namespace App\Http\Controllers;

use App\Models\TradingAccount;
use App\Models\Transaction;
use App\Models\SupportTicket;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        try {
            $userId = $request->session()->get('userId');
            $accounts = TradingAccount::where('user_id', $userId)->get();
            $transactions = Transaction::where('user_id', $userId)->get();
            $tickets = SupportTicket::where('user_id', $userId)->get();

            $deposits = $transactions->filter(fn($t) => $t->type === 'deposit' && $t->status === 'completed');
            $withdrawals = $transactions->filter(fn($t) => $t->type === 'withdrawal' && $t->status === 'completed');
            $totalDeposits = $deposits->sum(fn($d) => (float) $d->amount);
            $totalWithdrawals = $withdrawals->sum(fn($w) => (float) $w->amount);
            $walletBalance = $totalDeposits - $totalWithdrawals;
            $openTickets = $tickets->where('status', 'open')->count();

            return response()->json([
                'walletBalance' => $walletBalance,
                'totalDeposits' => $totalDeposits,
                'totalWithdrawals' => $totalWithdrawals,
                'totalCommissions' => 0,
                'tradingAccounts' => $accounts->count(),
                'openTickets' => $openTickets,
                'totalReferrals' => 0,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch dashboard stats'], 500);
        }
    }
}
