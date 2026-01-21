import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import { TransactionState } from "@/components/vault/TransactionStatus";
import TokenVaultABI from "@/contracts/TokenVault.json";

// Contract address - Update this with your deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Local Hardhat network default

interface VaultContextType {
  // Wallet state
  isConnected: boolean;
  address: string | null;
  isMetaMaskInstalled: boolean;
  userBalance: string;
  
  // Vault state
  contractBalance: string;
  userVaultBalance: string;
  contractOwnerAddress: string;
  network: string;
  isOwner: boolean;
  contractAddress: string;
  
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
  const [contractBalance, setContractBalance] = useState("0");
  const [userVaultBalance, setUserVaultBalance] = useState("0");
  const [contractOwnerAddress, setContractOwnerAddress] = useState("");
  const [network, setNetwork] = useState("Unknown");
  const [isOwner, setIsOwner] = useState(false);

  // Fetch contract data
  const fetchContractData = async () => {
    try {
      if (!(window as any).ethereum) return;
      
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenVaultABI.abi, provider);
      
      // Get contract balance (total ETH in contract)
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      const formattedBalance = ethers.formatEther(balance);
      setContractBalance(formattedBalance);
      
      // Get contract owner
      const owner = await contract.owner();
      setContractOwnerAddress(owner);
      
      // Get network info
      const networkInfo = await provider.getNetwork();
      let networkName = 'Unknown';
      
      if (networkInfo.chainId === 1337n || networkInfo.chainId === 31337n) {
        networkName = 'Localhost';
      } else if (networkInfo.chainId === 11155111n) {
        networkName = 'Sepolia';
      } else if (networkInfo.chainId === 1n) {
        networkName = 'Mainnet';
      } else {
        networkName = `Chain ${networkInfo.chainId}`;
      }
      
      setNetwork(networkName);
      
      // If user is connected, get their vault balance and check if they're owner
      if (address) {
        const userVaultBal = await contract.balances(address);
        const formattedUserVaultBalance = ethers.formatEther(userVaultBal);
        setUserVaultBalance(formattedUserVaultBalance);
        
        // Check if connected user is the owner
        setIsOwner(address.toLowerCase() === owner.toLowerCase());
      }
      
      console.log("Contract data fetched:", {
        contractBalance: formattedBalance,
        owner,
        network: networkInfo.name,
        userVaultBalance: address ? ethers.formatEther(await contract.balances(address)) : "0"
      });
    } catch (error) {
      console.error("Error fetching contract data:", error);
    }
  };

  // Fetch contract data on mount and when connected
  useEffect(() => {
    fetchContractData();
    
    // Set up an interval to refresh data every 10 seconds
    const interval = setInterval(() => {
      fetchContractData();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isConnected, address]);

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

  const handleDeposit = async (amount: string) => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxHash(undefined);
    setErrorMessage(undefined);

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenVaultABI.abi, signer);

      console.log("Depositing:", amount, "ETH");
      
      const tx = await contract.deposit({
        value: ethers.parseEther(amount)
      });
      
      setTxHash(tx.hash);
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      setTxStatus("success");
      
      // Refresh contract data after successful transaction
      setTimeout(() => {
        fetchContractData();
        connectWallet(); // Refresh user balance
      }, 1000);
      
    } catch (error: any) {
      console.error("Deposit failed:", error);
      setTxStatus("error");
      setErrorMessage(error.reason || error.message || "Deposit failed");
    }

    setIsLoading(false);
  };

  const handleWithdraw = async (amount: string) => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxHash(undefined);
    setErrorMessage(undefined);

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenVaultABI.abi, signer);

      console.log("Withdrawing:", amount, "ETH");
      
      const tx = await contract.withdraw(ethers.parseEther(amount));
      
      setTxHash(tx.hash);
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      setTxStatus("success");
      
      // Refresh contract data after successful transaction
      setTimeout(() => {
        fetchContractData();
        connectWallet(); // Refresh user balance
      }, 1000);
      
    } catch (error: any) {
      console.error("Withdraw failed:", error);
      setTxStatus("error");
      setErrorMessage(error.reason || error.message || "Withdraw failed");
    }

    setIsLoading(false);
  };

  const handleWithdrawAll = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setTxStatus("pending");
    setTxHash(undefined);
    setErrorMessage(undefined);

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenVaultABI.abi, signer);

      console.log("Withdrawing all funds");
      
      const tx = await contract.withdrawAll();
      
      setTxHash(tx.hash);
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      setTxStatus("success");
      
      // Refresh contract data after successful transaction
      setTimeout(() => {
        fetchContractData();
        connectWallet(); // Refresh user balance
      }, 1000);
      
    } catch (error: any) {
      console.error("Withdraw all failed:", error);
      setTxStatus("error");
      setErrorMessage(error.reason || error.message || "Withdraw all failed");
    }

    setIsLoading(false);
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
    userVaultBalance,
    contractOwnerAddress,
    network,
    isOwner,
    contractAddress: CONTRACT_ADDRESS,
    
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
