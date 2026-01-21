import { Vault } from "lucide-react";
import { useVault } from "@/context/vaultContext";
import WalletConnect from "@/components/vault/WalletConnect";
import VaultInfo from "@/components/vault/VaultInfo";
import DepositForm from "@/components/vault/DepositForm";
import WithdrawForm from "@/components/vault/WithdrawForm";
import TransactionStatus from "@/components/vault/TransactionStatus";

const Index = () => {
          const {
            isConnected,
            address,
            isMetaMaskInstalled,
            userBalance,
            contractBalance,
            userVaultBalance,
            contractOwnerAddress,
            network,
            isOwner,
            contractAddress,
            isLoading,
            txStatus,
            txHash,
            errorMessage,
            connectWallet,
            handleDisconnect,
            handleDeposit,
            handleWithdraw,
            handleWithdrawAll,
            dismissTransaction,
          } = useVault();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-xl mb-6 shadow-2xl border border-white/30 transition-transform hover:scale-110 duration-300">
            <Vault className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">TokenVault-DAPP</h1>
          {/* <p className="text-white/90 text-lg font-light">
            Secure Your Digital Assets with Confidence
          </p> */}
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Wallet Connection */}
          <WalletConnect
            isConnected={isConnected}
            address={address}
            isMetaMaskInstalled={isMetaMaskInstalled}
            onConnect={connectWallet}
            onDisconnect={handleDisconnect}
          />

          {/* Transaction Status */}
          <TransactionStatus
            status={txStatus}
            txHash={txHash}
            errorMessage={errorMessage}
            onDismiss={dismissTransaction}
          />

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Vault Info - Takes full width on mobile, left column on desktop */}
            <div className="lg:col-span-3">
              <VaultInfo
                userBalance={userBalance}
                contractBalance={contractBalance}
                userVaultBalance={userVaultBalance}
                contractOwnerAddress={contractOwnerAddress}
                connectedAddress={address}
                network={network}
                isConnected={isConnected}
                contractAddress={contractAddress}
                isOwner={isOwner}
              />
            </div>

            {/* Deposit Form */}
            <div className="lg:col-span-1">
              <DepositForm
                isConnected={isConnected}
                isLoading={isLoading}
                onDeposit={handleDeposit}
              />
            </div>

            {/* Withdraw Form */}
            <div className="lg:col-span-1">
              <WithdrawForm
                isConnected={isConnected}
                isLoading={isLoading}
                userBalance={userBalance}
                isOwner={isOwner}
                onWithdraw={handleWithdraw}
                onWithdrawAll={handleWithdrawAll}
              />
            </div>

            {/* Empty space for balance */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="vault-card h-full flex flex-col items-center justify-center text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-500/20 backdrop-blur-md border border-blue-400/30">
                    <Vault className="h-8 w-8 text-blue-300" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Quick Stats</h3>
                <div className="space-y-3 w-full">
                  <div>
                    <p className="text-sm text-white/60">Total Balance</p>
                    <p className="text-2xl font-bold text-blue-300">{contractBalance} ETH</p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-sm text-white/60">Network</p>
                    <p className="text-lg font-semibold text-white">{network}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-20 text-sm text-white/70">

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="font-medium">Powered by Ethereum</span>
            <span className="text-white/50">•</span>
            <span>Secured with MetaMask</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
