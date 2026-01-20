import { Wallet, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletConnectProps {
  isConnected: boolean;
  address: string | null;
  isMetaMaskInstalled: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const truncateAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const WalletConnect = ({
  isConnected,
  address,
  isMetaMaskInstalled,
  onConnect,
  onDisconnect,
}: WalletConnectProps) => {
  if (!isMetaMaskInstalled) {
    return (
      <div className="vault-card">
        <div className="flex items-center gap-3 text-yellow-300">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-semibold text-white">MetaMask Not Detected</p>
            <p className="text-sm text-white/70 mt-1">
              Please install MetaMask to use this DApp
            </p>
          </div>
        </div>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block"
        >
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">Install MetaMask</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="vault-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white">
              {isConnected ? "Connected" : "Wallet"}
            </p>
            {isConnected && address && (
              <p className="address-display mt-1">{truncateAddress(address)}</p>
            )}
          </div>
        </div>
        {isConnected ? (
          <Button variant="outline" onClick={onDisconnect} className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
            Disconnect
          </Button>
        ) : (
          <Button onClick={onConnect} className="bg-white/20 hover:bg-white/30 text-white border border-white/30">Connect Wallet</Button>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;
