import React, { useCallback, useEffect, useState } from "react";
import Accordion from "./Accordion";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Web3 from "web3";
import { useEthersSigner } from "../../config/ether";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import {
  useReadContract,
  useTransactionConfirmations,
  useWriteContract,
} from "wagmi";
const Staking = () => {
  const ABI = [
    {
      inputs: [
        { internalType: "string", name: "name_", type: "string" },
        { internalType: "address", name: "tokenAddress_", type: "address" },
        { internalType: "uint64", name: "rate_", type: "uint64" },
        { internalType: "uint256", name: "lockDuration_", type: "uint256" },
        { internalType: "uint256", name: "minStakeAmount_", type: "uint256" },
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
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "staker_",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount_",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "reward_",
          type: "uint256",
        },
      ],
      name: "PaidOut",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "staker_",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "reward_",
          type: "uint256",
        },
      ],
      name: "PaidOutReward",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint64",
          name: "index",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "newRate",
          type: "uint64",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "lockDuration",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      name: "RateAndLockduration",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "staker_",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "stakedAmount_",
          type: "uint256",
        },
      ],
      name: "ReStaked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "rewards",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      name: "RewardsAdded",
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
          name: "token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "staker_",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "stakedAmount_",
          type: "uint256",
        },
      ],
      name: "Staked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, internalType: "bool", name: "status", type: "bool" },
        {
          indexed: false,
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      name: "StakingStopped",
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
        { indexed: true, internalType: "address", name: "to", type: "address" },
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
      inputs: [],
      name: "ERC20Instance",
      outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "addReward",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "payable",
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
      inputs: [{ internalType: "address", name: "from", type: "address" }],
      name: "calculate",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "claimReward",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "index",
      outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isStopped",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lockDuration",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "minStakeAmount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
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
      inputs: [{ internalType: "bool", name: "_status", type: "bool" }],
      name: "pause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "rate",
      outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint64", name: "", type: "uint64" }],
      name: "rates",
      outputs: [
        { internalType: "uint64", name: "newInterestRate", type: "uint64" },
        { internalType: "uint256", name: "timeStamp", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "restake",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "rewardBalance",
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
      inputs: [
        { internalType: "uint64", name: "rate_", type: "uint64" },
        { internalType: "uint256", name: "lockduration_", type: "uint256" },
      ],
      name: "setRateAndLockduration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "stake",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "stakedBalance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "stakedTotal",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "tokenAddress",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalParticipants",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalReward",
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
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
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
      inputs: [{ internalType: "address", name: "user", type: "address" }],
      name: "userDeposits",
      outputs: [
        { internalType: "uint256", name: "depositAmount", type: "uint256" },
        { internalType: "uint256", name: "depositTime", type: "uint256" },
        { internalType: "uint256", name: "claimedTime", type: "uint256" },
        { internalType: "uint256", name: "endTime", type: "uint256" },
        { internalType: "uint256", name: "userIndex", type: "uint256" },
        { internalType: "uint256", name: "rewards", type: "uint256" },
        { internalType: "bool", name: "paid", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdraw",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    { stateMutability: "payable", type: "receive" },
  ];
  const polarFiABI = [
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
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
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "_decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "burn",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "subtractedValue", type: "uint256" },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "mint",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const { address } = useAccount();
  const {
    data: hash,
    isPending,
    error,
    isError,
    isSuccess,
    writeContract,
    writeContractAsync,
  } = useWriteContract();
  const [balance, setBalance] = useState<any>("");
  const [buydata, setBuy] = useState("");
  const [maticPer, setMaticPer] = useState(0);
  const signer = useEthersSigner();
  console.log(address, "addddddd");
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
      rightContent: <div>1.5% APR</div>,
      content: "<p>rETH&apos;s APR is calculated using a 7 day average</p>",
    },
  ];
  const calculatePercentage = (e: any) => {
    const finalPerData = (parseInt(e) * 1.5) / 100;
    setMaticPer(finalPerData);
  };
  console.log(maticPer, "maticPer");
  // useEffect(()=>{
  //   calculatePercentage()
  // },[buydata])
  const checkDeposit = useCallback(async () => {
    try {
      if (address && signer) {
        const contracts = new ethers.Contract(
          "0x236a1CB84E7de45dff7190EaB961ACc14a3e40A7",
          ABI,
          signer
        );
        const checkAllowance = await contracts.userDeposits(address, {
          gasLimit: "20000000",
        });
        console.log(
          parseInt(checkAllowance.depositAmount._hex),
          "checkAllowance"
        );
      }
    } catch (error) {
      console.error("Error in checkDeposit:", error);
    }
  }, [address, signer]);

  useEffect(() => {
    const intervalId = setInterval(checkDeposit, 60000);

    return () => clearInterval(intervalId);
  }, [checkDeposit]);
  const getToWei = (sell: string) => {
    let final = Web3.utils.toWei(sell, "ether");
    //@ts-ignore
    final = BigInt(final) .toString();
    console.log(final, "pppp");
    return final;
  };
  const checkAllowance = async () => {
    try {
      if (address) {
        const _amount = getToWei(buydata);
        let myBigInt: bigint = BigInt(_amount);

        console.log(typeof _amount, "_amount from buy");
        if (signer) {
          try {
            const contracts = new ethers.Contract(
              "0xBe51D05297FB603Dc9a39545e9cf21156ca058F2",
              polarFiABI,
              signer
            );
            const checkAllowance = await contracts.allowance(
              address,
              "0x236a1CB84E7de45dff7190EaB961ACc14a3e40A7",
              {
                gasLimit: "20000000",
              }
            );
            console.log(contracts, "contracts");
            const allowanceData = checkAllowance._hex;
            console.log(typeof allowanceData, "checkAllowance");
            if (BigInt(allowanceData) < BigInt(_amount)) {
              const tx = await contracts.increaseAllowance(
                "0x236a1CB84E7de45dff7190EaB961ACc14a3e40A7",
                _amount,
                {
                  gasLimit: "20000000",
                }
              );
              console.log("ttttttttttttttttttt");
            }
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
  const stake = async () => {
    try {
      if (address) {
        if (!buydata) {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter amount",
          });
        }
        await checkAllowance();
        const _amount = getToWei(buydata);
        console.log(_amount, "_amount from buy");
        if (signer) {
          try {
            const contracts = new ethers.Contract(
              "0x236a1CB84E7de45dff7190EaB961ACc14a3e40A7",
              ABI,
              signer
            );

            const tx = await contracts.stake(_amount, {
              gasLimit: "20000000",
            });
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

  const ReStaking = async () => {
    try {
      if (address) {
        if (signer) {
          const contracts = new ethers.Contract(
            "0x236a1CB84E7de45dff7190EaB961ACc14a3e40A7",
            ABI,
            signer
          );
          const tx = await contracts.restake({
            gasLimit: "20000000",
          });
        }
      }
    } catch (error) {}
  };
  const cliam_Reward = async () => {
    try {
      if (address) {
        if (signer) {
          const contracts = new ethers.Contract(
            "0x236a1CB84E7de45dff7190EaB961ACc14a3e40A7",
            ABI,
            signer
          );
          const tx = await contracts.claimReward({
            gasLimit: "20000000",
          });
        }
      }
    } catch (error) {}
  };
  const withdrawAmount = async () => {
    try {
      if (address) {
        if (signer) {
          const contracts = new ethers.Contract(
            "0x236a1CB84E7de45dff7190EaB961ACc14a3e40A7",
            ABI,
            signer
          );
          const tx = await contracts.withdraw({
            gasLimit: "20000000",
          });
        }
      }
    } catch (error) {}
  };
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
                      Balance: {balance ? balance.slice(0, 5) : "--"}{" "}
                      <span>Matic</span>
                    </span>
                  </div>
                </div>
                <div className="form-box">
                  <div className="relative">
                    <span className="icon-circle icon-pos absolute">
                      <img src="/img/eth-icon.png" alt="eth" />
                    </span>
                    <input
                      onChange={(e) => (
                        calculatePercentage(e.target.value),
                        setBuy(e.target.value)
                      )}
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
                    <p style={{ position: "relative", right: "-87px" }}>
                      {buydata && "(Can be claimed/withdrawn after 60 second)"}
                    </p>
                    <div
                      style={{ flex: 1, textAlign: "right" }}
                      className="right-c"
                    >
                      {buydata ? maticPer : "0"} Matic{" "}
                      <button
                        onClick={() => cliam_Reward()}
                        className="badge-lt-grey"
                      >
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
                onClick={() => (address ? stake() : open())}
              >
                {address ? "Stake" : "Connect Wallet"}
              </button>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => (address ? ReStaking() : open())}
            >
              {address ? "Restake" : "Connect Wallet"}
            </button>
            {address && (
              <button
                className="btn btn-primary"
                onClick={() => withdrawAmount()}
              >
                {address ? "Withdraw" : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Staking;
