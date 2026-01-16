import { useState } from "react";
import { ArrowUpFromLine, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WithdrawFormProps {
  isConnected: boolean;
  isLoading: boolean;
  userBalance: string;
  isOwner: boolean;
  onWithdraw: (amount: string) => void;
  onWithdrawAll: () => void;
}

const WithdrawForm = ({
  isConnected,
  isLoading,
  userBalance,
  isOwner,
  onWithdraw,
  onWithdrawAll,
}: WithdrawFormProps) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);
    const balance = parseFloat(userBalance);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (numAmount > balance) {
      setError("Withdrawal amount exceeds your balance");
      return;
    }

    onWithdraw(amount);
    setAmount("");
  };

  return (
    <div className="vault-card">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <ArrowUpFromLine className="h-6 w-6 text-white" />
        Withdraw ETH
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="withdraw-amount" className="vault-label">
            Amount (ETH)
          </label>
          <input
            id="withdraw-amount"
            type="number"
            step="0.001"
            min="0"
            placeholder="0.0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            className="vault-input"
            disabled={!isConnected || isLoading}
          />
          {error && (
            <p className="text-sm text-red-300 mt-2">{error}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold"
          disabled={!isConnected || isLoading}
        >
          {isLoading ? "Processing..." : "Withdraw"}
        </Button>
      </form>

      {isOwner && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-semibold text-white/90">
              Owner Action
            </span>
          </div>
          <Button
            variant="destructive"
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-300/30 font-semibold"
            onClick={onWithdrawAll}
            disabled={!isConnected || isLoading}
          >
            {isLoading ? "Processing..." : "Withdraw All Funds"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WithdrawForm;
