
import './App.css';


import { React, useState , useEffect} from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button, Card } from "react-bootstrap";
import TronWeb from 'tronweb'



const tokenContractAddress = "TEVDdsSRWxpPXv1JwGQ2V3ExrRyScpmQPe";

const tasksContractAddress = "TY2dL6sFD1jPmaNkhCDn4iGvLCXwCb1CCa";



const mainOptions = {
  fullNode: "https://api.shasta.trongrid.io",
  solidityNode: "https://api.shasta.trongrid.io",
  eventServer: "https://api.shasta.trongrid.io"
}






function App() {
  const [myMessage, setMyMessage] = useState(<h3> LOADING.. </h3>);
  const [myDetails, setMyDetails] = useState({
    name: 'none',
    address: 'none',
    balanceTron: 0,
    balancePlat:0,
    frozenBalance: 0,
    network: 'none',
    link: 'false',
  });

  const getBalance = async () => {
    //if wallet installed and logged , getting TRX token balance
    if (window.tronWeb && window.tronWeb.ready) {
      let walletBalances = await window.tronWeb.trx.getAccount(
        window.tronWeb.defaultAddress.base58
      );
      return walletBalances;
    } else {
      return 0;
    }
  };

  const getWalletDetails = async () => {
    if (window.tronWeb) {
      //checking if wallet injected
      if (window.tronWeb.ready) {
        let tempBalance = await getBalance();
        let tempFrozenBalance = 0;

        if (!tempBalance.balance) {
          tempBalance.balance = 0;
        }

        //checking if any frozen balance exists
        if (
          !tempBalance.frozen &&
          !tempBalance.account_resource.frozen_balance_for_energy
        ) {
          tempFrozenBalance = 0;
        } else {
          if (
            tempBalance.frozen &&
            tempBalance.account_resource.frozen_balance_for_energy
          ) {
            tempFrozenBalance =
              tempBalance.frozen[0].frozen_balance +
              tempBalance.account_resource.frozen_balance_for_energy
                .frozen_balance;
          }
          if (
            tempBalance.frozen &&
            !tempBalance.account_resource.frozen_balance_for_energy
          ) {
            tempFrozenBalance = tempBalance.frozen[0].frozen_balance;
          }
          if (
            !tempBalance.frozen &&
            tempBalance.account_resource.frozen_balance_for_energy
          ) {
            tempFrozenBalance =
              tempBalance.account_resource.frozen_balance_for_energy
                .frozen_balance;
          }
        }
        let contract = await getContractToken();
        let amountPlat = contract.balanceOf(window.tronWeb.defaultAddress.base58).call().then(function(data) {

          console.log(data);
          let res = window.tronWeb.toDecimal(data["_hex"]);
          console.log(res);
          return res;
        });

        let amountPlatRes = await amountPlat;
        
        //we have wallet and we are logged in
        setMyMessage(<h3>WALLET CONNECTED</h3>);
        setMyDetails({
          name: window.tronWeb.defaultAddress.name,
          address: window.tronWeb.defaultAddress.base58,
          balanceTron: tempBalance.balance / 1000000,
          balancePlat:amountPlatRes,
          frozenBalance: tempFrozenBalance / 1000000,
          network: window.tronWeb.fullNode.host,
          link: 'true',
        });
      } else {
        //we have wallet but not logged in
        setMyMessage(<h3>WALLET DETECTED PLEASE LOGIN</h3>);
        setMyDetails({
          name: 'none',
          address: 'none',
          balanceTron: 0,
          balancePlat:0,
          frozenBalance: 0,
          network: 'none',
          link: 'false',
        });
      }
    } else {
      //wallet is not detected at all
      setMyMessage(<h3>WALLET NOT DETECTED</h3>);
    }
  };



  function walletInstalled(){
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        return true;
    } else {
        return false;
    } 
}

const createCampaign = async () =>{
  let contract = await getContractTasks();
  let id = "abc";
  let amount_deposit = window.tronWeb.toBigNumber('5000000000000000000').toString();
  if (contract) {

    contract.createCampaign(id,amount_deposit).send({
      feeLimit: 100_000_000,
    })
  }

  else {
    console.log("No contract task")
  }
}



async function getContractTasks(){
  if(walletInstalled()){
      return window.tronWeb.contract().at(tasksContractAddress);
  }
}


async function getContractToken(){
    if(walletInstalled()){
        return window.tronWeb.contract().at(tokenContractAddress);
    }
}



  useEffect(() => {
    const interval = setInterval(async () => {
      getWalletDetails();
      //wallet checking interval 2sec
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div className="App">
      <div className="Card">
        <h1> TRON WALLET & REACT INTEGRATION </h1>
        <div className="Stats">
          {myMessage}
          <h4>Account Name: {myDetails.name} </h4>
          <h4>My Address: {myDetails.address}</h4>
          <h4>
            BalanceTron: {myDetails.balanceTron} TRX (Frozen:{' '}
            {myDetails.frozenBalance} TRX)
          </h4>
          <h4>
            BalancePlat: {myDetails.balancePlat} PLT 
          </h4>
          <h4>Network Selected: {myDetails.network}</h4>
          <h4>Link Established: {myDetails.link}</h4>
        </div>

        <Button onClick={createCampaign} variant="primary">
			    Create Campaign
		    </Button>
      </div>
    </div>
  );
}


export default App;
