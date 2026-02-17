import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Shield,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import type { KycDocument } from "@shared/schema";
export default function KycPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery<KycDocument[]>({
    queryKey: ["/api/kyc/documents"],
  });

  const allDocs = documents || [];
  const approved = allDocs.filter((d) => d.status === "approved").length;
  const pendingDocs = allDocs.filter((d) => d.status === "pending");
  const total = allDocs.length;
  const allApproved = total > 0 && approved === total;
  const hasPending = pendingDocs.length > 0;

  const [docType, setDocType] = useState("passport");
  const [fileName, setFileName] = useState("");

  const uploadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/kyc/documents", {
        documentType: docType,
        fileName: fileName || `${docType}_document.pdf`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kyc/documents"] });
      toast({ title: "Document uploaded successfully" });
      setUploadOpen(false);
      setFileName("");
    },
    onError: () => {
      toast({ title: "Upload failed", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return (
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs no-default-hover-elevate no-default-active-elevate">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    }
    if (status === "pending") {
      return (
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs no-default-hover-elevate no-default-active-elevate">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs no-default-hover-elevate no-default-active-elevate">
        <XCircle className="w-3 h-3 mr-1" />
        Rejected
      </Badge>
    );
  };

  const formatDocType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const renderDocumentRow = (doc: KycDocument) => (
    <div
      key={doc.id}
      className="flex items-center justify-between gap-4 flex-wrap py-4 border-b last:border-0"
      data-testid={`row-document-${doc.id}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm">{formatDocType(doc.documentType)}</p>
          <p className="text-xs text-muted-foreground truncate">{doc.fileName}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "N/A"}
          </p>
          {doc.reviewedBy && (
            <p className="text-xs text-muted-foreground">Reviewed by: {doc.reviewedBy}</p>
          )}
        </div>
        {getStatusBadge(doc.status)}
      </div>
      {doc.notes && (
        <p className="text-xs text-muted-foreground w-full pl-12">{doc.notes}</p>
      )}
    </div>
  );

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
        <Shield className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
      <Button variant="outline" onClick={() => setUploadOpen(true)} data-testid="button-upload-empty">
        <Upload className="w-4 h-4 mr-2" />
        Upload Document
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-kyc-title">KYC Verification</h1>
          <p className="text-sm text-muted-foreground">Upload documents and complete your identity verification</p>
        </div>
        <Button onClick={() => setUploadOpen(true)} data-testid="button-upload-document">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="font-medium">Verification Status</p>
                <p className="text-sm text-muted-foreground">
                  {approved > 0 ? `${approved} of ${total} documents verified` : "No documents submitted yet"}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {allApproved ? "Verified" : hasPending ? "Under Review" : "Action Required"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b px-4 pt-3">
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all-documents">All Documents</TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending-review">Pending Review</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="px-5 pb-5" data-testid="table-kyc-documents">
              {isLoading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">Loading documents...</div>
              ) : allDocs.length === 0 ? (
                emptyState
              ) : (
                allDocs.map(renderDocumentRow)
              )}
            </TabsContent>

            <TabsContent value="pending" className="px-5 pb-5">
              {isLoading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">Loading documents...</div>
              ) : pendingDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No documents pending review</p>
                </div>
              ) : (
                pendingDocs.map(renderDocumentRow)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger data-testid="select-doc-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="national_id">National ID</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="proof_of_address">Proof of Address</SelectItem>
                  <SelectItem value="bank_statement">Bank Statement</SelectItem>
                  <SelectItem value="utility_bill">Utility Bill</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>File URL</Label>
              <Input
                placeholder="document.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                data-testid="input-file-name"
              />
            </div>
            <div className="border-2 border-dashed rounded-md p-8 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB)</p>
            </div>
            <Button
              className="w-full"
              onClick={() => uploadMutation.mutate()}
              disabled={uploadMutation.isPending}
              data-testid="button-submit-document"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
