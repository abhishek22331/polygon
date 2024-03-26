import React, { useState } from "react";
import Accordion from "./Accordion";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Web3 from "web3";
import { useEthersSigner } from "../../config/ether";
import { ethers } from "ethers";
import Swal from "sweetalert2";

const Staking = () => {
  const ABI = [
    
      {
        inputs: [
          { internalType: "address", name: "_tokenAddress", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "TaxAmount",
            type: "uint256",
          },
        ],
        name: "Buy",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
        ],
        name: "RewardPaid",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "TaxAmount",
            type: "uint256",
          },
        ],
        name: "Sell",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Staked",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "TaxAmount",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Unstaked",
        type: "event",
      },
      {
        inputs: [],
        name: "DAILY_REWARD",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "ERC20Instance",
        outputs: [
          { internalType: "contract IERC20", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "MIN_LOCK_DURATION",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "REWARD_RATE",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "buy",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "buyTaxRate",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "claimReward",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "getRewardBalance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "getStakeBalance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "rewards",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "sell",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "sellTaxRate",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "stake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "stakes",
        outputs: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "startTimestamp", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalStaked",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "transferTaxRate",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "unstake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
  
    const { address } = useAccount();

  const [balance, setBalance] = useState<any>("");
  const [buydata, setBuy] = useState("");
  const signer = useEthersSigner();
console.log(address,"addddddd")
  const { open } = useWeb3Modal();
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // Instantiate Web3 with MetaMask's provider
    const web3 = new Web3(window.ethereum);

    const getAccountBalance = async () => {
      try {
        // Request accounts access if not already granted
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Get the selected account
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0]; // Assuming the first account is the one you want to check
        // Get the balance of the account
        const balance = await web3.eth.getBalance(address);
        // Convert balance from Wei to Ether
        const balanceInEther = web3.utils.fromWei(balance, "ether");
        return balanceInEther;
      } catch (error) {
        console.error("Error fetching account balance:", error);
        return null;
      }
    };

    // Usage
    getAccountBalance().then((balance) => {
      setBalance(balance?.toString());
      console.log("Account balance:", balance);
    });
  } else {
    console.error("MetaMask is not installed or not detected.");
  }
  // Define the staking function

  console.log(balance, "balancebalance");
  const accordionItems = [
    {
      title: "Staked Amount",
      rightContent: <div>0 FROST</div>,
      content:
        "<p>Determines whether you are using the protocol&apos;s deposit pool or being routed through secondary markets.</p><p>Note that there is a 0.05% deposit fee when minting rETH through the protocol. This fee prevents attacks around rate updates. The income from this fee is distributed to all rETH holders.</p>",
    },
    {
      title: "Wallet Balance",
      rightContent: <div>0 FROST</div>,
      content: "Paragraph 1 for Item 1. <p>Paragraph 2 for Item 1.</p>",
    },
    {
      title: "APR Rate",
      rightContent: <div>0% APR</div>,
      content: "<p>rETH&apos;s APR is calculated using a 7 day average</p>",
    },
  ];
  const getToWei = (sell: string) => {
    let final = Web3.utils.toWei(sell, "ether");
    console.log(final, "pppp");
    return final;
  };
  const buyToken = async () => {
    try {
      if (address) {
        if(!buydata){
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter amount",
          });
        }
        const _amount = getToWei(buydata);
        console.log(_amount, "_amount from buy");
        if (signer) {
          try {
            const contracts = new ethers.Contract(
              "0xb10C3BE52bC95EF9c347AbEf41d11bDB0546cB28",
              ABI,
              signer
            );
            console.log(contracts,"contractscontractscontractscontractscontractscontractscontractscontractscontractscontractscontracts")
            const tx = await contracts.stake(_amount, {
              gasLimit: "20000000",
            });
            console.log(tx, "tytttttttttttttt");
          } catch (error) {}
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please connect Your wallet",
          });
        }
      }
    } catch (error) {}
  };


  const unStaking=async()=>{
    try {
      if(address){
        if(signer){
          const contracts = new ethers.Contract(
            "0xb10C3BE52bC95EF9c347AbEf41d11bDB0546cB28",
            ABI,
            signer
          ); 
          const tx = await contracts.unstake({
            gasLimit: "20000000",
          });
        }
      }
    } catch (error) {
      
    }
  }
  const cliam_Reward=async()=>{
    try {
      if(address){
        if(signer){
          const contracts = new ethers.Contract(
            "0xb10C3BE52bC95EF9c347AbEf41d11bDB0546cB28",
            ABI,
            signer
          ); 
          const tx = await contracts.claimReward({
            gasLimit: "20000000",
          });
        }
      }
    } catch (error) {
      
    }
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4">
        {/* Additional content can be placed here */}
      </div>
      <div className="center wide">
        <div className="w-full text-gray">
          <div className="mx-auto fl-all-g-10">
            <div className="flex h-full flex-col justify-between stack-out">
              <div className="relative">
                <div className="stack-p">
                  <div>
                    <span className="">Stake FROST</span>
                  </div>
                  <div>
                    <span className="text-xxs sm:text-base">
                      {" "}
                      Balance: {balance ?balance.slice(0, 5):"--"} <span>Matic</span>
                    </span>
                  </div>
                </div>
                <div className="form-box">
                  <div className="relative">
                    <span className="icon-circle icon-pos absolute">
                      <img src="/img/eth-icon.png" alt="eth" />
                    </span>
                    <input
                      onChange={(e) => setBuy(e.target.value)}
                      type="number"
                      name="vstack"
                      placeholder="Enter the amount in FROST"
                      className="form-textbox pad-left pd-r-90"
                    />
                    <span className="group-text-right t-pos">
                      <button className="badge-purple badge-max text-white ">
                        Max
                      </button>
                    </span>
                  </div>
                </div>

                <Accordion items={accordionItems} />

                <div>
                  <div className="acc-title border-b-none">
                    <strong style={{ flex: 2 }}>Reward Balance</strong>
                    <div
                      style={{ flex: 1, textAlign: "right" }}
                      className="right-c"
                    >
                      0 Matic{" "}
                      <button disabled className="badge-lt-grey">
                        Claim
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <button
                className="btn btn-primary"
                onClick={()=>(address ? buyToken() : open())}
              >
                {address ? "Staking" : "Connect Wallet"}
              </button>
            </div>
            <button  className="btn btn-primary" onClick={()=>(address ? unStaking():open())}>{address ? "Unstaking":"Connect Wallet"}</button>
            <button  className="btn btn-primary" onClick={()=>(address ? cliam_Reward():open())}>{address ? "Cliam Reward":"Connect Wallet"}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Staking;
