<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\TicketReply;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    public function index(Request $request)
    {
        try {
            $tickets = SupportTicket::where('user_id', $request->session()->get('userId'))
                ->orderByDesc('created_at')
                ->get();
            return response()->json($tickets->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch tickets'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'subject' => 'required|string|min:1',
                'message' => 'required|string|min:1',
                'priority' => 'sometimes|in:low,medium,high',
                'category' => 'sometimes|string',
            ]);

            $ticket = SupportTicket::create([
                'user_id' => $request->session()->get('userId'),
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'priority' => $validated['priority'] ?? 'medium',
                'category' => $validated['category'] ?? 'general',
                'status' => 'open',
            ]);

            return response()->json($ticket->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create ticket'], 400);
        }
    }

    public function updateStatus(Request $request, string $id)
    {
        try {
            $validated = $request->validate(['status' => 'required|string']);
            $ticket = SupportTicket::find($id);
            if (!$ticket) return response()->json(['error' => 'Ticket not found'], 404);
            $ticket->update(['status' => $validated['status']]);
            return response()->json($ticket->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update ticket'], 400);
        }
    }

    public function getReplies(string $id)
    {
        try {
            $replies = TicketReply::where('ticket_id', $id)->orderBy('created_at')->get();
            return response()->json($replies->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch replies'], 500);
        }
    }

    public function storeReply(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'userId' => 'required|string',
                'message' => 'required|string|min:1',
                'isAdmin' => 'sometimes|boolean',
            ]);

            $reply = TicketReply::create([
                'ticket_id' => $id,
                'user_id' => $validated['userId'],
                'message' => $validated['message'],
                'is_admin' => $validated['isAdmin'] ?? false,
            ]);

            return response()->json($reply->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to create reply'], 400);
        }
    }
}
