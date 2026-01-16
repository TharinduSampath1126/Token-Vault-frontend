import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepositFormProps {
  isConnected: boolean;
  isLoading: boolean;
  onDeposit: (amount: string) => void;
}

const DepositForm = ({ isConnected, isLoading, onDeposit }: DepositFormProps) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    onDeposit(amount);
    setAmount("");
  };

  return (
    <div className="vault-card">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <ArrowDownToLine className="h-6 w-6 text-white" />
        Deposit ETH
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="deposit-amount" className="vault-label">
            Amount (ETH)
          </label>
          <input
            id="deposit-amount"
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
          {isLoading ? "Processing..." : "Deposit"}
        </Button>
      </form>
    </div>
  );
};

export default DepositForm;
