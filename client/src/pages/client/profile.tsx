import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Mail, Phone, MapPin, Shield, Calendar, CheckCircle, Edit, Plus, Building2, Wallet, Loader2, Globe } from "lucide-react";
import { Link } from "wouter";

interface BankAccount {
  id: number;
  accountHolder: string;
  bankName: string;
  iban: string;
  status: "Active" | "Pending Verification";
}

interface CryptoWallet {
  id: number;
  label: string;
  address: string;
  network: string;
  status: "Active" | "Pending Verification";
}

const cryptoNetworks = [
  "Bitcoin",
  "Ethereum (ERC-20)",
  "Tron (TRC-20)",
  "BNB Smart Chain (BEP-20)",
  "Solana",
  "Polygon",
  "Arbitrum One",
  "Optimism",
  "Lightning Network",
];

export default function ProfilePage() {
  const { user } = useAuth();
  const initials = user?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U";

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: 1, accountHolder: "John Doe", bankName: "Chase Bank", iban: "US12 3456 7890 1234 5678 90", status: "Active" },
    { id: 2, accountHolder: "John Doe", bankName: "Wells Fargo", iban: "US98 7654 3210 9876 5432 10", status: "Pending Verification" },
  ]);

  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([
    { id: 1, label: "My BTC Wallet", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "Bitcoin", status: "Active" },
    { id: 2, label: "ETH DeFi Wallet", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18", network: "Ethereum (ERC-20)", status: "Pending Verification" },
  ]);

  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  const [bankForm, setBankForm] = useState({ accountHolder: "", bankName: "", accountNumber: "", swiftCode: "" });
  const [walletForm, setWalletForm] = useState({ label: "", address: "", network: "" });

  const [bankOtpStep, setBankOtpStep] = useState<"form" | "otp" | "success">("form");
  const [walletOtpStep, setWalletOtpStep] = useState<"form" | "otp" | "success">("form");
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const fields = [
    { label: "Full Name", value: user?.fullName || "N/A", icon: User },
    { label: "Email", value: user?.email || "N/A", icon: Mail },
    { label: "Phone", value: user?.phone || "N/A", icon: Phone },
    { label: "Country", value: user?.country || "N/A", icon: MapPin },
    { label: "KYC Status", value: user?.kycStatus || "N/A", icon: Shield },
    { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A", icon: Calendar },
  ];

  const kycVerified = user?.kycStatus === "approved" || user?.kycStatus === "verified";

  const handleBankSendOtp = () => {
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setBankOtpStep("otp");
    }, 1500);
  };

  const handleBankVerifyOtp = () => {
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setBankOtpStep("success");
      const newBank: BankAccount = {
        id: Date.now(),
        accountHolder: bankForm.accountHolder,
        bankName: bankForm.bankName,
        iban: bankForm.accountNumber,
        status: "Pending Verification",
      };
      setBankAccounts((prev) => [...prev, newBank]);
    }, 1500);
  };

  const handleWalletSendOtp = () => {
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setWalletOtpStep("otp");
    }, 1500);
  };

  const handleWalletVerifyOtp = () => {
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setWalletOtpStep("success");
      const newWallet: CryptoWallet = {
        id: Date.now(),
        label: walletForm.label,
        address: walletForm.address,
        network: walletForm.network,
        status: "Pending Verification",
      };
      setCryptoWallets((prev) => [...prev, newWallet]);
    }, 1500);
  };

  const resetBankDialog = () => {
    setBankDialogOpen(false);
    setBankOtpStep("form");
    setBankForm({ accountHolder: "", bankName: "", accountNumber: "", swiftCode: "" });
    setOtpValue("");
  };

  const resetWalletDialog = () => {
    setWalletDialogOpen(false);
    setWalletOtpStep("form");
    setWalletForm({ label: "", address: "", network: "" });
    setOtpValue("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your account information</p>
      </div>

      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-xl p-6 text-white shadow-sm" data-testid="card-profile-header">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white/20">
            <AvatarFallback className="bg-white/20 text-white text-3xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-2xl font-bold" data-testid="text-profile-name">{user?.fullName || "User"}</h2>
            <p className="text-brand-100 text-sm mt-1" data-testid="text-profile-email">{user?.email || ""}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap justify-center sm:justify-start">
              {kycVerified ? (
                <Badge className="bg-emerald-500/20 text-white border-0 no-default-hover-elevate no-default-active-elevate">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Member
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-white border-0 no-default-hover-elevate no-default-active-elevate">
                  <Shield className="w-3 h-3 mr-1" />
                  Unverified
                </Badge>
              )}
              <Badge className="bg-white/15 text-white border-0 no-default-hover-elevate no-default-active-elevate capitalize">
                {user?.role || "client"}
              </Badge>
              <Badge className={`border-0 no-default-hover-elevate no-default-active-elevate ${user?.status === "active" ? "bg-emerald-500/20 text-white" : "bg-white/15 text-white"}`}>
                {user?.status || "N/A"}
              </Badge>
            </div>
          </div>
          <div className="shrink-0">
            <Link href="/settings">
              <Button variant="outline" className="border-white/30 text-white backdrop-blur-sm bg-white/10" data-testid="button-edit-profile">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-account-details">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start gap-3">
              <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg shrink-0">
                <field.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">{field.label}</p>
                <p className="font-semibold text-gray-900 dark:text-white truncate" data-testid={`text-profile-${field.label.toLowerCase().replace(/\s+/g, '-')}`}>{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-account-activity">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Last Login</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-last-login">Today</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Account Type</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize" data-testid="text-account-type">{user?.role || "client"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Login IP Address</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-login-ip">192.168.1.105</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Last Access IP Address</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-last-access-ip">203.0.113.42</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <Badge variant="secondary" className={`text-xs no-default-hover-elevate no-default-active-elevate ${user?.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : ""}`} data-testid="text-account-status">
                {user?.status || "N/A"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-quick-links">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <div className="space-y-3">
            <Link href="/settings">
              <div className="flex items-center gap-3 p-3 rounded-lg hover-elevate cursor-pointer">
                <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="link-edit-settings">Edit Settings</span>
              </div>
            </Link>
            <Link href="/kyc">
              <div className="flex items-center gap-3 p-3 rounded-lg hover-elevate cursor-pointer">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Shield className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="link-kyc-verification">KYC Verification</span>
              </div>
            </Link>
            <Link href="/support">
              <div className="flex items-center gap-3 p-3 rounded-lg hover-elevate cursor-pointer">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="link-support">Contact Support</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-bank-details">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
              <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bank Details</h3>
          </div>
          <Button onClick={() => setBankDialogOpen(true)} data-testid="button-add-bank">
            <Plus className="w-4 h-4 mr-2" />
            Add Bank Account
          </Button>
        </div>

        <div className="space-y-4">
          {bankAccounts.map((bank) => (
            <div key={bank.id} className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex-wrap" data-testid={`row-bank-${bank.id}`}>
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
                  <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate" data-testid={`text-bank-name-${bank.id}`}>{bank.bankName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate" data-testid={`text-bank-holder-${bank.id}`}>{bank.accountHolder}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate" data-testid={`text-bank-iban-${bank.id}`}>{bank.iban}</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`text-xs no-default-hover-elevate no-default-active-elevate shrink-0 ${bank.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}
                data-testid={`badge-bank-status-${bank.id}`}
              >
                {bank.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-crypto-wallets">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
              <Wallet className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Crypto Wallet Details</h3>
          </div>
          <Button onClick={() => setWalletDialogOpen(true)} data-testid="button-add-wallet">
            <Plus className="w-4 h-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        <div className="space-y-4">
          {cryptoWallets.map((wallet) => (
            <div key={wallet.id} className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 flex-wrap" data-testid={`row-wallet-${wallet.id}`}>
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
                  <Wallet className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate" data-testid={`text-wallet-label-${wallet.id}`}>{wallet.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate" data-testid={`text-wallet-address-${wallet.id}`}>{wallet.address}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs no-default-hover-elevate no-default-active-elevate" data-testid={`badge-wallet-network-${wallet.id}`}>
                      <Globe className="w-3 h-3 mr-1" />
                      {wallet.network}
                    </Badge>
                  </div>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`text-xs no-default-hover-elevate no-default-active-elevate shrink-0 ${wallet.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}
                data-testid={`badge-wallet-status-${wallet.id}`}
              >
                {wallet.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={bankDialogOpen} onOpenChange={(open) => { if (!open) resetBankDialog(); }}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add Bank Account</DialogTitle>
            <DialogDescription className="text-gray-400">
              {bankOtpStep === "form" && "Enter your bank account details below."}
              {bankOtpStep === "otp" && "Enter the OTP sent to your email to verify."}
              {bankOtpStep === "success" && "Your bank account has been submitted for verification."}
            </DialogDescription>
          </DialogHeader>

          {bankOtpStep === "form" && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Account Holder Name</Label>
                <Input
                  className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Enter account holder name"
                  value={bankForm.accountHolder}
                  onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                  data-testid="input-bank-holder"
                />
              </div>
              <div>
                <Label className="text-gray-300">Bank Name</Label>
                <Input
                  className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Enter bank name"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  data-testid="input-bank-name"
                />
              </div>
              <div>
                <Label className="text-gray-300">Account Number / IBAN</Label>
                <Input
                  className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Enter account number or IBAN"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  data-testid="input-bank-account-number"
                />
              </div>
              <div>
                <Label className="text-gray-300">SWIFT / BIC Code</Label>
                <Input
                  className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Enter SWIFT or BIC code"
                  value={bankForm.swiftCode}
                  onChange={(e) => setBankForm({ ...bankForm, swiftCode: e.target.value })}
                  data-testid="input-bank-swift"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleBankSendOtp}
                disabled={!bankForm.accountHolder || !bankForm.bankName || !bankForm.accountNumber || otpLoading}
                data-testid="button-bank-send-otp"
              >
                {otpLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                Send OTP to Email
              </Button>
            </div>
          )}

          {bankOtpStep === "otp" && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Enter OTP Code</Label>
                <Input
                  className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Enter 6-digit OTP"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  data-testid="input-bank-otp"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleBankVerifyOtp}
                disabled={!otpValue || otpLoading}
                data-testid="button-bank-verify-otp"
              >
                {otpLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Verify OTP
              </Button>
            </div>
          )}

          {bankOtpStep === "success" && (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white" data-testid="text-bank-success">Bank Account Added</p>
                <p className="text-sm text-gray-400 mt-1">Your bank account is now pending admin verification.</p>
              </div>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 no-default-hover-elevate no-default-active-elevate" data-testid="badge-bank-pending">
                Pending Verification
              </Badge>
              <div>
                <Button variant="outline" className="border-gray-700 text-gray-300" onClick={resetBankDialog} data-testid="button-bank-close">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={walletDialogOpen} onOpenChange={(open) => { if (!open) resetWalletDialog(); }}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add Crypto Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">
              {walletOtpStep === "form" && "Enter your crypto wallet details below."}
              {walletOtpStep === "otp" && "Enter the OTP sent to your email to verify."}
              {walletOtpStep === "success" && "Your crypto wallet has been submitted for verification."}
            </DialogDescription>
          </DialogHeader>

          {walletOtpStep === "form" && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Wallet Label</Label>
                <Input
                  className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Enter wallet label"
                  value={walletForm.label}
                  onChange={(e) => setWalletForm({ ...walletForm, label: e.target.value })}
                  data-testid="input-wallet-label"
                />
              </div>
              <div>
                <Label className="text-gray-300">Wallet Address</Label>
                <Input
                  className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Enter wallet address"
                  value={walletForm.address}
                  onChange={(e) => setWalletForm({ ...walletForm, address: e.target.value })}
                  data-testid="input-wallet-address"
                />
              </div>
              <div>
                <Label className="text-gray-300">Network</Label>
                <Select value={walletForm.network} onValueChange={(val) => setWalletForm({ ...walletForm, network: val })}>
                  <SelectTrigger className="mt-1 bg-gray-900 border-gray-700 text-white" data-testid="select-wallet-network">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f172a] border-gray-700">
                    {cryptoNetworks.map((net) => (
                      <SelectItem key={net} value={net} className="text-white" data-testid={`option-network-${net.toLowerCase().replace(/[\s()/-]+/g, '-')}`}>
                        {net}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={handleWalletSendOtp}
                disabled={!walletForm.label || !walletForm.address || !walletForm.network || otpLoading}
                data-testid="button-wallet-send-otp"
              >
                {otpLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                Send OTP to Email
              </Button>
            </div>
          )}

          {walletOtpStep === "otp" && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Enter OTP Code</Label>
                <Input
                  className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Enter 6-digit OTP"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  data-testid="input-wallet-otp"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleWalletVerifyOtp}
                disabled={!otpValue || otpLoading}
                data-testid="button-wallet-verify-otp"
              >
                {otpLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Verify OTP
              </Button>
            </div>
          )}

          {walletOtpStep === "success" && (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white" data-testid="text-wallet-success">Crypto Wallet Added</p>
                <p className="text-sm text-gray-400 mt-1">Your crypto wallet is now pending admin verification.</p>
              </div>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 no-default-hover-elevate no-default-active-elevate" data-testid="badge-wallet-pending">
                Pending Verification
              </Badge>
              <div>
                <Button variant="outline" className="border-gray-700 text-gray-300" onClick={resetWalletDialog} data-testid="button-wallet-close">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
