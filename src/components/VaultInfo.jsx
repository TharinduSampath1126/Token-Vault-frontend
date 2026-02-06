import { useEffect, useState } from "react";
import { useVaultContract } from "../contracts/useVaultContract";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";

const VAULT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function VaultInfo() {

  const vault = useVaultContract();
  const { provider } = useWallet();

  const [vaultOwner, setVaultOwner] = useState("");
  const [vaultBalance, setVaultBalance] = useState("0");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    loadVaultData();
  }, [vault, provider]);

  async function loadVaultData() {
    if (!vault || !provider) return;
    
    setLoading(true);
    try {
      // Get owner details from contract
      const owner = await vault.owner();
      console.log("Owner", owner);
      setVaultOwner(owner);

      // Get vault balance
      const balance = await provider.getBalance(VAULT_ADDRESS);
      const formattedBalance = ethers.formatEther(balance);
      console.log("Vault Balance", formattedBalance);
      setVaultBalance(formattedBalance);
    } catch (error) {
      console.error("Error loading vault data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Mock data for UI display
  const userBalance = '2.5';
  const network = 'Sepolia Testnet';

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Vault Information</h2>

      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <p style={styles.infoLabel}>Your Vault Balance</p>
          <p style={styles.infoValue}>{userBalance} ETH</p>
        </div>

        <div style={styles.infoCard}>
          <p style={styles.infoLabel}>Total Vault Balance</p>
          <p style={styles.infoValue}>{vaultBalance} ETH</p>
        </div>

        <div style={styles.infoCard}>
          <p style={styles.infoLabel}>Contract Owner</p>
          <p style={styles.infoValueSmall}>{vaultOwner.slice(0, 6)}...{vaultOwner.slice(-4)}</p>
          <p style={styles.fullAddress}>{vaultOwner}</p>
        </div>

        <div style={styles.infoCard}>
          <p style={styles.infoLabel}>Network</p>
          <p style={styles.infoValueSmall}>{network}</p>
        </div>
      </div>

      <button style={styles.refreshButton} onClick={loadVaultData} disabled={loading}>
        {loading ? '⏳ Loading...' : '🔄 Refresh'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '15px',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
  },
  infoLabel: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    color: '#666',
    fontWeight: 'bold',
  },
  infoValue: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2196F3',
    fontFamily: 'monospace',
  },
  infoValueSmall: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  fullAddress: {
    margin: '5px 0 0 0',
    fontSize: '10px',
    color: '#999',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  refreshButton: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
