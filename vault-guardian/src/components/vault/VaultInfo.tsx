import { Vault, Globe, User, Coins } from "lucide-react";

interface VaultInfoProps {
  userBalance: string;
  contractBalance: string;
  contractOwnerAddress: string;
  connectedAddress: string | null;
  network: string;
  isConnected: boolean;
}

const truncateAddress = (address: string): string => {
  if (!address) return "—";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const VaultInfo = ({
  userBalance,
  contractBalance,
  contractOwnerAddress,
  connectedAddress,
  network,
  isConnected,
}: VaultInfoProps) => {
  const infoItems = [
    {
      icon: Coins,
      label: "Your Vault Balance",
      value: isConnected ? `${userBalance} ETH` : "—",
    },
    {
      icon: Vault,
      label: "Contract Balance",
      value: `${contractBalance} ETH`,
    },
    {
      icon: User,
      label: "Contract Owner",
      value: truncateAddress(contractOwnerAddress),
      isAddress: true,
    },
    {
      icon: User,
      label: "Connected Address",
      value: isConnected && connectedAddress ? truncateAddress(connectedAddress) : "—",
      isAddress: true,
    },
    {
      icon: Globe,
      label: "Network",
      value: network,
    },
  ];

  return (
    <div className="vault-card">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Vault className="h-6 w-6 text-white" />
        Vault Information
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {infoItems.map((item) => (
          <div key={item.label}>
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="h-4 w-4 text-white/70" />
              <span className="vault-label mb-0">{item.label}</span>
            </div>
            <p
              className={`vault-value ${
                item.isAddress ? "font-mono text-lg" : ""
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaultInfo;
