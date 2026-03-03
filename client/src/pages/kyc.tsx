import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Lock,
  Globe,
  Zap,
  CreditCard,
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

  const verificationSteps = [
    { step: 1, label: "Identity Document", desc: "Passport, National ID, or Driver's License", icon: FileText, done: allDocs.some(d => ["passport", "national_id", "drivers_license"].includes(d.documentType) && d.status === "approved") },
    { step: 2, label: "Proof of Address", desc: "Utility bill or bank statement (within 3 months)", icon: Globe, done: allDocs.some(d => ["proof_of_address", "utility_bill", "bank_statement"].includes(d.documentType) && d.status === "approved") },
    { step: 3, label: "Verification Complete", desc: "Account fully verified and ready to trade", icon: CheckCircle, done: allApproved && total >= 2 },
  ];

  const whyVerifyBenefits = [
    { icon: Lock, title: "Account Security", desc: "Protect your account and funds from unauthorized access" },
    { icon: Zap, title: "Faster Withdrawals", desc: "Verified accounts enjoy priority processing on withdrawals" },
    { icon: CreditCard, title: "Higher Limits", desc: "Increase your deposit and withdrawal limits significantly" },
    { icon: Globe, title: "Full Access", desc: "Unlock all trading features and platform capabilities" },
  ];

  const renderDocumentRow = (doc: KycDocument) => (
    <div
      key={doc.id}
      className="flex items-center justify-between gap-4 flex-wrap py-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
      data-testid={`row-document-${doc.id}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg shrink-0">
          <FileText className="w-4 h-4 text-sky-600" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-gray-900 dark:text-white">{formatDocType(doc.documentType)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{doc.fileName}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "N/A"}
          </p>
          {doc.reviewedBy && (
            <p className="text-xs text-gray-500 dark:text-gray-400">Reviewed by: {doc.reviewedBy}</p>
          )}
        </div>
        {getStatusBadge(doc.status)}
      </div>
      {doc.notes && (
        <p className="text-xs text-gray-500 dark:text-gray-400 w-full pl-12">{doc.notes}</p>
      )}
    </div>
  );

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
        <Shield className="w-6 h-6 text-sky-600" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">No documents uploaded yet</p>
      <Button variant="outline" onClick={() => setUploadOpen(true)} data-testid="button-upload-empty">
        <Upload className="w-4 h-4 mr-2" />
        Upload Document
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-kyc-title">KYC Verification</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upload documents and complete your identity verification</p>
        </div>
        <Button onClick={() => setUploadOpen(true)} data-testid="button-upload-document">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-verification-status">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg shrink-0">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Verification Status</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {approved > 0 ? `${approved} of ${total} documents verified` : "No documents submitted yet"}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className={`text-xs no-default-hover-elevate no-default-active-elevate ${allApproved ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : hasPending ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`} data-testid="badge-verification-status">
            {allApproved ? "Verified" : hasPending ? "Under Review" : "Action Required"}
          </Badge>
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-verification-steps">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Verification Steps</h3>
        <div className="flex flex-col md:flex-row gap-6">
          {verificationSteps.map((step, idx) => (
            <div key={step.step} className="flex-1 flex items-start gap-3">
              <div className={`p-3 rounded-lg shrink-0 ${step.done ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-gray-100 dark:bg-gray-800"}`}>
                <step.icon className={`w-5 h-5 ${step.done ? "text-emerald-600" : "text-gray-400 dark:text-gray-500"}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Step {step.step}: {step.label}</p>
                  {step.done && (
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-xs no-default-hover-elevate no-default-active-elevate">Done</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.desc}</p>
              </div>
              {idx < verificationSteps.length - 1 && (
                <div className="hidden md:block w-12 h-px bg-gray-200 dark:bg-gray-700 self-center shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all overflow-visible">
        <Tabs defaultValue="all">
          <div className="border-b border-gray-100 dark:border-gray-800 px-6 pt-4">
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all-documents">All Documents</TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending-review">Pending Review</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="px-6 pb-6" data-testid="table-kyc-documents">
            {isLoading ? (
              <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading documents...</div>
            ) : allDocs.length === 0 ? (
              emptyState
            ) : (
              allDocs.map(renderDocumentRow)
            )}
          </TabsContent>

          <TabsContent value="pending" className="px-6 pb-6">
            {isLoading ? (
              <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading documents...</div>
            ) : pendingDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                  <Clock className="w-6 h-6 text-sky-600" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No documents pending review</p>
              </div>
            ) : (
              pendingDocs.map(renderDocumentRow)
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-why-verify">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Why Verify Your Account?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyVerifyBenefits.map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-start gap-3">
              <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                <benefit.icon className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{benefit.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Select the document type and upload your verification file.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Document Type</Label>
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
              <Label className="text-gray-700 dark:text-gray-300">File URL</Label>
              <Input
                placeholder="document.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                data-testid="input-file-name"
              />
            </div>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
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
