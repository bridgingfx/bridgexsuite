<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TradingAccountController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\KycController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\IbController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SuperAdminController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout']);
Route::get('/auth/me', [AuthController::class, 'me']);

Route::middleware(['auth.custom'])->group(function () {

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::middleware(['admin.custom'])->group(function () {
        Route::get('/clients', [AdminController::class, 'clients']);
        Route::post('/clients', function (Request $request) {
            try {
                $validated = $request->validate([
                    'username' => 'required|string|min:1',
                    'password' => 'required|string|min:1',
                    'fullName' => 'required|string|min:1',
                    'email' => 'required|email',
                    'phone' => 'sometimes|string',
                    'role' => 'sometimes|in:client,ib,lead,admin',
                    'country' => 'sometimes|string',
                    'status' => 'sometimes|string',
                    'kycStatus' => 'sometimes|string',
                ]);

                $client = User::create([
                    'username' => $validated['username'],
                    'password' => Hash::make($validated['password']),
                    'full_name' => $validated['fullName'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'role' => $validated['role'] ?? 'client',
                    'country' => $validated['country'] ?? null,
                    'status' => $validated['status'] ?? 'active',
                    'kyc_status' => $validated['kycStatus'] ?? 'pending',
                ]);

                return response()->json($client->toArray());
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage() ?: 'Failed to create client'], 400);
            }
        });
        Route::patch('/clients/{id}', function (Request $request, string $id) {
            try {
                $client = User::find($id);
                if (!$client) return response()->json(['error' => 'Client not found'], 404);
                $data = $request->only(['username', 'email', 'phone', 'role', 'status', 'country', 'avatar']);
                if ($request->has('fullName')) $data['full_name'] = $request->input('fullName');
                if ($request->has('kycStatus')) $data['kyc_status'] = $request->input('kycStatus');
                $client->update($data);
                return response()->json($client->fresh()->toArray());
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to update client'], 400);
            }
        });
    });

    Route::get('/trading-accounts', [TradingAccountController::class, 'index']);
    Route::post('/trading-accounts', [TradingAccountController::class, 'store']);
    Route::post('/trading-accounts/internal-transfer', [TradingAccountController::class, 'internalTransfer']);
    Route::get('/trading-accounts/{id}', [TradingAccountController::class, 'show']);
    Route::post('/trading-accounts/{id}/change-password', [TradingAccountController::class, 'changePassword']);
    Route::patch('/trading-accounts/{id}/leverage', [TradingAccountController::class, 'changeLeverage']);
    Route::post('/trading-accounts/{id}/deposit', [TradingAccountController::class, 'deposit']);
    Route::post('/trading-accounts/{id}/withdraw', [TradingAccountController::class, 'withdraw']);

    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/recent', [TransactionController::class, 'recent']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::patch('/transactions/{id}/status', [TransactionController::class, 'updateStatus']);
    Route::patch('/transactions/{id}/cancel', [TransactionController::class, 'cancel']);
    Route::post('/wallet-transfer', [TransactionController::class, 'walletTransfer']);
    Route::post('/commission-transfer', [TransactionController::class, 'commissionTransfer']);

    Route::get('/kyc/documents', [KycController::class, 'index']);
    Route::post('/kyc/documents', [KycController::class, 'store']);
    Route::patch('/kyc/documents/{id}', [KycController::class, 'update']);

    Route::get('/ib/referrals', [IbController::class, 'referrals']);
    Route::post('/ib/referrals', [IbController::class, 'storeReferral']);
    Route::get('/commissions', [IbController::class, 'commissions']);

    Route::get('/support/tickets', [SupportController::class, 'index']);
    Route::post('/support/tickets', [SupportController::class, 'store']);
    Route::patch('/support/tickets/{id}/status', [SupportController::class, 'updateStatus']);
    Route::get('/support/tickets/{id}/replies', [SupportController::class, 'getReplies']);
    Route::post('/support/tickets/{id}/replies', [SupportController::class, 'storeReply']);

    Route::get('/prop/challenges', [ModuleController::class, 'propChallenges']);
    Route::get('/prop/accounts', [ModuleController::class, 'propAccounts']);
    Route::post('/prop/accounts', [ModuleController::class, 'createPropAccount']);

    Route::get('/investments/plans', [ModuleController::class, 'investmentPlans']);
    Route::get('/investments', [ModuleController::class, 'investments']);
    Route::post('/investments', [ModuleController::class, 'createInvestment']);

    Route::get('/copy/providers', [ModuleController::class, 'copyProviders']);
    Route::get('/copy/relationships', [ModuleController::class, 'copyRelationships']);
    Route::post('/copy/relationships', [ModuleController::class, 'createCopyRelationship']);
    Route::patch('/copy/relationships/{id}', [ModuleController::class, 'updateCopyRelationship']);

    Route::get('/pamm/managers', [ModuleController::class, 'pammManagers']);
    Route::get('/pamm/investments', [ModuleController::class, 'pammInvestments']);
    Route::post('/pamm/investments', [ModuleController::class, 'createPammInvestment']);

    Route::prefix('admin')->middleware(['admin.custom'])->group(function () {
        Route::get('/dashboard/stats', [AdminController::class, 'dashboardStats']);
        Route::get('/clients', [AdminController::class, 'clients']);
        Route::get('/clients/{id}', [AdminController::class, 'clientDetail']);
        Route::patch('/clients/{id}', [AdminController::class, 'updateClient']);
        Route::patch('/clients/{id}/status', [AdminController::class, 'updateClientStatus']);
        Route::patch('/clients/{id}/kyc-status', [AdminController::class, 'updateClientKycStatus']);

        Route::get('/trading-accounts', [AdminController::class, 'tradingAccounts']);
        Route::post('/trading-accounts', [AdminController::class, 'createTradingAccount']);
        Route::patch('/trading-accounts/{id}', [AdminController::class, 'updateTradingAccount']);

        Route::get('/transactions', [AdminController::class, 'transactions']);
        Route::get('/transactions/pending', [AdminController::class, 'pendingTransactions']);
        Route::post('/transactions/{id}/approve', [AdminController::class, 'approveTransaction']);
        Route::post('/transactions/{id}/reject', [AdminController::class, 'rejectTransaction']);

        Route::get('/kyc/documents', [AdminController::class, 'kycDocuments']);
        Route::get('/kyc/pending', [AdminController::class, 'pendingKycDocuments']);
        Route::post('/kyc/documents/{id}/review', [AdminController::class, 'reviewKycDocument']);

        Route::get('/ib/referrals', [AdminController::class, 'ibReferrals']);
        Route::get('/commissions', [AdminController::class, 'commissions']);
        Route::get('/commission-tiers', [AdminController::class, 'commissionTiers']);
        Route::post('/commission-tiers', [AdminController::class, 'createCommissionTier']);

        Route::get('/support/tickets', [AdminController::class, 'supportTickets']);
        Route::patch('/support/tickets/{id}/status', [AdminController::class, 'updateTicketStatus']);
        Route::patch('/support/tickets/{id}/assign', [AdminController::class, 'assignTicket']);
        Route::post('/support/tickets/{id}/reply', [AdminController::class, 'replyToTicket']);

        Route::get('/settings', [AdminController::class, 'settings']);
        Route::post('/settings', [AdminController::class, 'upsertSetting']);
    });

    Route::prefix('super-admin')->middleware(['superadmin.custom'])->group(function () {
        Route::get('/dashboard/stats', [SuperAdminController::class, 'dashboardStats']);

        Route::get('/brokers', [SuperAdminController::class, 'brokers']);
        Route::get('/brokers/{id}', [SuperAdminController::class, 'brokerDetail']);
        Route::post('/brokers', [SuperAdminController::class, 'createBroker']);
        Route::patch('/brokers/{id}', [SuperAdminController::class, 'updateBroker']);
        Route::post('/brokers/{id}/suspend', [SuperAdminController::class, 'suspendBroker']);
        Route::post('/brokers/{id}/activate', [SuperAdminController::class, 'activateBroker']);
        Route::get('/brokers/{id}/branding', [SuperAdminController::class, 'getBranding']);
        Route::patch('/brokers/{id}/branding', [SuperAdminController::class, 'updateBranding']);
        Route::get('/brokers/{id}/admins', [SuperAdminController::class, 'brokerAdmins']);

        Route::get('/plans', [SuperAdminController::class, 'plans']);
        Route::post('/plans', [SuperAdminController::class, 'createPlan']);
        Route::patch('/plans/{id}', [SuperAdminController::class, 'updatePlan']);

        Route::get('/subscriptions', [SuperAdminController::class, 'subscriptions']);
        Route::post('/subscriptions', [SuperAdminController::class, 'createSubscription']);
        Route::patch('/subscriptions/{id}', [SuperAdminController::class, 'updateSubscription']);

        Route::get('/admins', [SuperAdminController::class, 'admins']);
        Route::post('/admins', [SuperAdminController::class, 'createAdmin']);
        Route::patch('/admins/{id}', [SuperAdminController::class, 'updateAdmin']);

        Route::get('/platform-settings', [SuperAdminController::class, 'platformSettings']);
        Route::post('/platform-settings', [SuperAdminController::class, 'upsertPlatformSetting']);
    });
});
