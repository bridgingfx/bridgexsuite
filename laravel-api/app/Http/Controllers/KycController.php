<?php

namespace App\Http\Controllers;

use App\Models\KycDocument;
use Illuminate\Http\Request;

class KycController extends Controller
{
    public function index(Request $request)
    {
        try {
            $docs = KycDocument::where('user_id', $request->session()->get('userId'))
                ->orderByDesc('created_at')
                ->get();
            return response()->json($docs->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch KYC documents'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'documentType' => 'required|string|min:1',
                'fileName' => 'required|string|min:1',
            ]);

            $doc = KycDocument::create([
                'user_id' => $request->session()->get('userId'),
                'document_type' => $validated['documentType'],
                'file_name' => $validated['fileName'],
                'status' => 'pending',
            ]);

            return response()->json($doc->toArray());
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()[array_key_first($e->errors())][0]], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() ?: 'Failed to upload document'], 400);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string',
                'notes' => 'sometimes|string',
            ]);

            $doc = KycDocument::find($id);
            if (!$doc) return response()->json(['error' => 'Document not found'], 404);

            $doc->update([
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? $doc->notes,
            ]);

            return response()->json($doc->fresh()->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update document'], 400);
        }
    }
}
