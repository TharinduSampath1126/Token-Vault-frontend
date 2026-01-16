import { Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export type TransactionState = "idle" | "pending" | "success" | "error";

interface TransactionStatusProps {
  status: TransactionState;
  txHash?: string;
  errorMessage?: string;
  onDismiss: () => void;
}

const TransactionStatus = ({
  status,
  txHash,
  errorMessage,
  onDismiss,
}: TransactionStatusProps) => {
  if (status === "idle") return null;

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin" />,
          title: "Transaction Pending",
          description: "Please wait while your transaction is being processed...",
          className: "status-pending border-yellow-300/40",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="h-6 w-6" />,
          title: "Transaction Successful",
          description: txHash ? `Transaction Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}` : "Your transaction was completed successfully.",
          className: "bg-green-500/10 text-green-100 border-green-300/40",
        };
      case "error":
        return {
          icon: <XCircle className="h-6 w-6" />,
          title: "Transaction Failed",
          description: errorMessage || "An error occurred while processing your transaction.",
          className: "bg-red-500/10 text-red-100 border-red-300/40",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div
      className={`vault-card border ${config.className} flex items-start justify-between gap-4`}
    >
      <div className="flex items-start gap-3">
        {config.icon}
        <div>
          <p className="font-semibold text-white">{config.title}</p>
          <p className="text-sm mt-1 text-white/80">{config.description}</p>
          {status === "success" && txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm mt-2 text-white underline hover:no-underline"
            >
              View on Etherscan
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
      {status !== "pending" && (
        <button
          onClick={onDismiss}
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};

export default TransactionStatus;
