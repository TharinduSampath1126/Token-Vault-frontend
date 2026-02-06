import { useState } from 'react';

export default function OwnerActions() {
  const [message, setMessage] = useState({ type: '', text: '' });
  const isOwner = true; // Mock - set to false to hide this component

  const handleWithdrawAll = () => {
    // Mock success for UI demo
    setMessage({ type: 'success', text: '✅ Successfully withdrew all funds from vault!' });

    // Clear message after 3 seconds
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Don't show if not owner
  if (!isOwner) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>👑 Owner Actions</h3>
      
      <div style={styles.ownerBadge}>
        <p style={styles.badgeText}>✅ You are the contract owner</p>
      </div>

      <p style={styles.description}>
        As the owner, you can withdraw all funds from the vault in one transaction.
      </p>

      <button onClick={handleWithdrawAll} style={styles.button}>
        🚨 Withdraw All Funds
      </button>

      {message.text && (
        <div style={styles.successBox}>
          <p style={styles.messageText}>{message.text}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    border: '2px solid #f57c00',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: '#fff3e0',
  },
  title: {
    marginTop: 0,
    marginBottom: '15px',
    fontSize: '18px',
    color: '#e65100',
  },
  ownerBadge: {
    backgroundColor: '#e8f5e9',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    border: '1px solid #4CAF50',
  },
  badgeText: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  description: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px',
    borderRadius: '5px',
    marginTop: '15px',
  },
  messageText: {
    margin: 0,
    fontSize: '14px',
  },
};
