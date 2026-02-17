import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertCircle,
  Plus,
  Eye,
} from "lucide-react";
import type { KycDocument } from "@shared/schema";
import { useLocation } from "wouter";

export default function KycPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();

  const defaultTab = location === "/kyc/documents" ? "documents" : "verification";

  const { data: documents, isLoading } = useQuery<KycDocument[]>({
    queryKey: ["/api/kyc/documents"],
  });

  const verified = (documents || []).filter((d) => d.status === "approved").length;
  const pending = (documents || []).filter((d) => d.status === "pending").length;
  const rejected = (documents || []).filter((d) => d.status === "rejected").length;

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

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-kyc-title">KYC Verification</h1>
          <p className="text-sm text-muted-foreground">Manage identity verification and documents</p>
        </div>
        <Button onClick={() => setUploadOpen(true)} data-testid="button-upload-document">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Documents</p>
              <p className="text-lg font-bold">{(documents || []).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-lg font-bold">{verified}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold">{pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-lg font-bold">{rejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue={defaultTab}>
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="verification" data-testid="tab-verification">Verification Status</TabsTrigger>
                <TabsTrigger value="documents" data-testid="tab-documents">Documents</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="verification" className="p-6">
              <div className="space-y-4">
                <VerificationStep
                  title="Identity Document"
                  description="Passport, National ID, or Driver's License"
                  status={(documents || []).find(d => d.documentType === "passport" || d.documentType === "national_id")?.status || "not_submitted"}
                />
                <VerificationStep
                  title="Proof of Address"
                  description="Utility bill, Bank statement (less than 3 months old)"
                  status={(documents || []).find(d => d.documentType === "proof_of_address")?.status || "not_submitted"}
                />
                <VerificationStep
                  title="Selfie Verification"
                  description="Photo holding your ID document"
                  status={(documents || []).find(d => d.documentType === "selfie")?.status || "not_submitted"}
                />
              </div>
            </TabsContent>

            <TabsContent value="documents" className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-kyc-documents">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Document Type</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">File Name</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Loading...</td></tr>
                    ) : (documents || []).length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No documents uploaded</td></tr>
                    ) : (
                      (documents || []).map((doc) => (
                        <tr key={doc.id} className="border-b last:border-0">
                          <td className="py-3 px-3 capitalize">{doc.documentType.replace(/_/g, " ")}</td>
                          <td className="py-3 px-3 text-muted-foreground">{doc.fileName}</td>
                          <td className="py-3 px-3">
                            <Badge
                              variant={doc.status === "approved" ? "default" : doc.status === "pending" ? "secondary" : "destructive"}
                              className={doc.status === "approved" ? "bg-emerald-500/10 text-emerald-500" : doc.status === "pending" ? "bg-amber-500/10 text-amber-500" : ""}
                            >
                              {doc.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "N/A"}</td>
                          <td className="py-3 px-3 text-muted-foreground">{doc.notes || "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
                  <SelectItem value="selfie">Selfie with ID</SelectItem>
                  <SelectItem value="bank_statement">Bank Statement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>File Name</Label>
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

function VerificationStep({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) {
  const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    approved: { icon: <CheckCircle className="w-5 h-5 text-emerald-500" />, label: "Verified", color: "bg-emerald-500/10 text-emerald-500" },
    pending: { icon: <Clock className="w-5 h-5 text-amber-500" />, label: "Pending Review", color: "bg-amber-500/10 text-amber-500" },
    rejected: { icon: <XCircle className="w-5 h-5 text-red-500" />, label: "Rejected", color: "bg-red-500/10 text-red-500" },
    not_submitted: { icon: <AlertCircle className="w-5 h-5 text-muted-foreground" />, label: "Not Submitted", color: "bg-muted text-muted-foreground" },
  };

  const config = statusConfig[status] || statusConfig.not_submitted;

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {config.icon}
          <div>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <Badge variant="secondary" className={`${config.color} text-xs`}>
          {config.label}
        </Badge>
      </CardContent>
    </Card>
  );
}
