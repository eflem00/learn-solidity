import "./App.css";
import web3 from "./web3";
import contract from "./contract";
import { useEffect, useState } from "react";

const App = () => {
  const [manager, setManager] = useState("");
  const [account, setAccount] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [enterAmount, setEnterAmount] = useState("");
  const [enterPending, setEnterPending] = useState(false);
  const [pickPending, setPickPending] = useState(false);

  const refreshState = async () => {
    const accounts = await web3.eth.getAccounts();
    const blc = await web3.eth.getBalance(contract.options.address);
    const mgr = await contract.methods.manager().call();
    const pls = await contract.methods.getPlayers().call();
    setAccount(accounts[0]);
    setBalance(web3.utils.fromWei(blc));
    setManager(mgr);
    setPlayers(pls);
  };

  const enterLottery = async (event) => {
    try {
      event.preventDefault();
      setEnterPending(true);
      await contract.methods.enter().send({
        from: account,
        gas: "1000000",
        value: web3.utils.toWei(enterAmount, "ether"),
      });
      await refreshState();
    } finally {
      setEnterPending(false);
    }
  };

  const pickWinner = async () => {
    try {
      setPickPending(true);
      await contract.methods.pickWinner().send({
        from: manager,
        gas: "1000000",
      });
      await refreshState();
    } finally {
      setPickPending(false);
    }
  };

  useEffect(() => {
    refreshState();
  }, []);

  return (
    <div className="App">
      <h2>Lottery Contract</h2>

      <p>User: {account}</p>
      <p>Manager: {manager}</p>
      <p>Number of players: {players.length}</p>
      <p>Lottery pool: {balance} eth</p>

      <form onSubmit={enterLottery}>
        <label>Amount: </label>
        <input
          onChange={(event) => setEnterAmount(event.target.value)}
          value={enterAmount}
        />
        <button disabled={enterPending}>Enter</button>
      </form>

      {manager === account && (
        <button onClick={pickWinner} disabled={pickPending}>
          Pick Winner
        </button>
      )}
    </div>
  );
};

export default App;
