import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferToAddress, setTransferToAddress] = useState("");

  // Replace with your deployed contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet, "any"); // Use "any" to avoid ENS errors
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const deposit = async () => {
    if (atm && depositAmount > 0) {
      let tx = await atm.deposit({ value: ethers.utils.parseEther(depositAmount) });
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm && withdrawAmount > 0) {
      let tx = await atm.withdraw(ethers.utils.parseEther(withdrawAmount));
      await tx.wait();
      getBalance();
    }
  };

const transfer = async () => {
  if (atm && transferAmount > 0 && transferToAddress) {
    let tx = await atm.transfer(transferToAddress, ethers.utils.parseEther(transferAmount));
    await tx.wait();
    getBalance();
  }
};

  

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }
    if (!account) {
      return <button onClick={connectAccount} style={buttonStyle}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <div style={inputGroupStyle}>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter deposit amount in ETH"
            style={inputStyle}
          />
          <button onClick={deposit} style={buttonStyle}>Deposit</button>
        </div>
        <div style={inputGroupStyle}>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter withdraw amount in ETH"
            style={inputStyle}
          />
          <button onClick={withdraw} style={buttonStyle}>Withdraw</button>
        </div>
        <div style={inputGroupStyle}>
          <input
            type="text"
            value={transferToAddress}
            onChange={(e) => setTransferToAddress(e.target.value)}
            placeholder="Enter recipient address"
            style={inputStyle}
          />
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Enter transfer amount in ETH"
            style={inputStyle}
          />
          <button onClick={transfer} style={buttonStyle}>Transfer</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  const buttonStyle = {
    backgroundColor: "#a1887f", /* button color */
    color: "white",
    border: "none",
    padding: "10px 20px",
    margin: "10px 5px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontSize: "16px",
  };

  const inputGroupStyle = {
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const inputStyle = {
    padding: "10px",
    marginRight: "10px",
    border: "1px solid #a1887f",
    borderRadius: "5px",
    width: "calc(100% - 120px)", /* Adjust width to fit input and button in a row */
    fontSize: "16px",
  };

  return (
    <main style={containerStyle}>
      <header style={headerStyle}>
        <h1>Metamask Wallet!</h1>
      </header>
      {initUser()}
    </main>
  );
}

const containerStyle = {
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f5f5dc", /* pastel brown */
  color: "#4b3832",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const headerStyle = {
  marginBottom: "2rem",
  backgroundColor: "#8d6e63", /* darker pastel brown */
  width: "100%",
  padding: "1rem 0",
  color: "white",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};
