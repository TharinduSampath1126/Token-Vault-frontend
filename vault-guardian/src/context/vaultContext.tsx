import { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";
import { TransactionState } from "@/components/vault/TransactionStatus";

interface VaultContextType {
  // Wallet state
  isConnected: boolean;
  address: string | null;
  isMetaMaskInstalled: boolean;
  userBalance: string;
  
  // Vault state
  contractBalance: string;
  contractOwnerAddress: string;
  network: string;
  isOwner: boolean;
  
  // Transaction state
  isLoading: boolean;
  txStatus: TransactionState;
  txHash: string | undefined;
  errorMessage: string | undefined;
  
  // Functions
  connectWallet: () => Promise<void>;
  handleDisconnect: () => void;
  handleDeposit: (amount: string) => void;
  handleWithdraw: (amount: string) => void;
  handleWithdrawAll: () => void;
  dismissTransaction: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
};

interface VaultProviderProps {
  children: ReactNode;
}

export const VaultProvider = ({ children }: VaultProviderProps) => {
  // Wallet state
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isMetaMaskInstalled] = useState(
    typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined"
  );

  // Vault state
  const [userBalance, setUserBalance] = useState("0");
  const [contractBalance] = useState("25.75");
  const contractOwnerAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f4A321";
  const [network] = useState("Sepolia");
  const [isOwner] = useState(true);

  // Transaction state
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<TransactionState>("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const connectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
        alert("MetaMask is not installed. Please install it to use this DApp.");
        return;
      }

      await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Get balance with error handling
      let formattedBalance = "0";
      try {
        const balance = await provider.getBalance(walletAddress);
        formattedBalance = ethers.formatEther(balance);
      } catch (balanceError) {
        console.error("Error fetching balance:", balanceError);
        alert(
          "Connected to wallet but couldn't fetch balance. Please check your MetaMask network settings and ensure you're connected to a valid RPC."
        );
      }

      console.log("Connected address:", walletAddress);
      console.log("Balance:", formattedBalance, "ETH");

      setAddress(walletAddress);
      setUserBalance(formattedBalance);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  const simulateTransaction = async (action: string) => {
    setIsLoading(true);
    setTxStatus("pending");
    setTxHash(undefined);
    setErrorMessage(undefined);

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success (90% chance) or error (10% chance)
    if (Math.random() > 0.1) {
      setTxStatus("success");
      setTxHash("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
    } else {
      setTxStatus("error");
      setErrorMessage(`${action} failed: User rejected transaction`);
    }

    setIsLoading(false);
  };

  const handleDeposit = (amount: string) => {
    console.log("Depositing:", amount, "ETH");
    simulateTransaction("Deposit");
  };

  const handleWithdraw = (amount: string) => {
    console.log("Withdrawing:", amount, "ETH");
    simulateTransaction("Withdraw");
  };

  const handleWithdrawAll = () => {
    console.log("Withdrawing all funds");
    simulateTransaction("Withdraw All");
  };

  const dismissTransaction = () => {
    setTxStatus("idle");
    setTxHash(undefined);
    setErrorMessage(undefined);
  };

  const value: VaultContextType = {
    // Wallet state
    isConnected,
    address,
    isMetaMaskInstalled,
    userBalance,
    
    // Vault state
    contractBalance,
    contractOwnerAddress,
    network,
    isOwner,
    
    // Transaction state
    isLoading,
    txStatus,
    txHash,
    errorMessage,
    
    // Functions
    connectWallet,
    handleDisconnect,
    handleDeposit,
    handleWithdraw,
    handleWithdrawAll,
    dismissTransaction,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
};
