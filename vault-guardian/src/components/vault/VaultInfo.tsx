import { Vault, Globe, User, Coins, Shield, ExternalLink, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VaultInfoProps {
  userBalance: string;
  contractBalance: string;
  userVaultBalance: string;
  contractOwnerAddress: string;
  connectedAddress: string | null;
  network: string;
  isConnected: boolean;
  contractAddress: string;
  isOwner: boolean;
}

const truncateAddress = (address: string): string => {
  if (!address) return "—";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard!`);
};

const VaultInfo = ({
  userBalance,
  contractBalance,
  userVaultBalance,
  contractOwnerAddress,
  connectedAddress,
  network,
  isConnected,
  contractAddress,
  isOwner,
}: VaultInfoProps) => {
  const [showFullAddresses, setShowFullAddresses] = useState(false);

  const formatAddress = (address: string) => {
    if (!address) return "—";
    return showFullAddresses ? address : truncateAddress(address);
  };

  const openEtherscan = (address: string) => {
    let baseUrl = 'https://etherscan.io';
    
    if (network.toLowerCase() === 'sepolia') {
      baseUrl = 'https://sepolia.etherscan.io';
    } else if (network.toLowerCase() === 'localhost') {
      copyToClipboard(address, 'Address');
      return;
    }
    
    window.open(`${baseUrl}/address/${address}`, '_blank');
  };

  return (
    <div className="vault-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Vault className="h-6 w-6 text-white" />
          Vault Information
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullAddresses(!showFullAddresses)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {showFullAddresses ? 'Hide' : 'Show'} Full Addresses
          </Button>
          {isOwner && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-400/30">
              <Shield className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Owner</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Wallet Balance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-blue-400" />
            <span className="vault-label mb-0">Wallet Balance</span>
          </div>
          <p className="vault-value text-blue-300">
            {isConnected ? `${parseFloat(userBalance).toFixed(4)} ETH` : "—"}
          </p>
        </div>

        {/* User Vault Balance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Vault className="h-4 w-4 text-green-400" />
            <span className="vault-label mb-0">Your Vault Balance</span>
          </div>
          <p className="vault-value text-green-300">
            {isConnected ? `${parseFloat(userVaultBalance).toFixed(4)} ETH` : "—"}
          </p>
        </div>

        {/* Total Contract Balance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Vault className="h-4 w-4 text-purple-400" />
            <span className="vault-label mb-0">Total Contract Balance</span>
          </div>
          <p className="vault-value text-purple-300">
            {parseFloat(contractBalance).toFixed(4)} ETH
          </p>
        </div>

        {/* Contract Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-400" />
            <span className="vault-label mb-0">Contract Address</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="vault-value font-mono text-sm text-orange-300">
              {formatAddress(contractAddress)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(contractAddress, 'Contract address')}
              className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEtherscan(contractAddress)}
              className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Contract Owner */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-yellow-400" />
            <span className="vault-label mb-0">Contract Owner</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="vault-value font-mono text-sm text-yellow-300">
              {formatAddress(contractOwnerAddress)}
            </p>
            {contractOwnerAddress && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(contractOwnerAddress, 'Owner address')}
                  className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEtherscan(contractOwnerAddress)}
                  className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Connected Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            <span className="vault-label mb-0">Connected Address</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="vault-value font-mono text-sm text-cyan-300">
              {isConnected && connectedAddress ? formatAddress(connectedAddress) : "—"}
            </p>
            {isConnected && connectedAddress && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(connectedAddress, 'Your address')}
                  className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEtherscan(connectedAddress)}
                  className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Network */}
        <div className="space-y-2 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-400" />
            <span className="vault-label mb-0">Network</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <p className="vault-value text-indigo-300">{network}</p>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      {isConnected && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Connection Status:</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="text-green-400 font-medium">Connected</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-white/60">Total Deposited:</span>
            <span className="text-white font-medium">{parseFloat(userVaultBalance).toFixed(4)} ETH</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultInfo;
