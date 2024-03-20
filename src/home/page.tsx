"use client";
import React, { useState } from "react";
import { BigNumber, ethers } from "ethers";
import Swal from "sweetalert2";
import web3 from "web3";
declare global {
  interface Window {
    ethereum?: any; // Allow ethereum to be undefined
  }
}
// import ABI from "@/abi/ABI"
const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC20Instance",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyTaxRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "sell",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "sellTaxRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "transferTaxRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
import {
  useAccount,
  useConnections,
  useReadContract,
  useTransactionConfirmations,
  useWriteContract,
} from "wagmi";
import { useEthersSigner } from "../../config/ether";
// import { ABI } from "../../abi/abi";
const Card = (addresssss: any) => {
  const { address } = useAccount();
  const signer = useEthersSigner();

  const [selldata, setSell] = useState("");
  const [buydata, setBuy] = useState("");
  const [transfer, setTransfer] = useState("");
  const [sellper, setSellper] = useState(0);
  const [buyper, setBuyper] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  const [transferper, setTransferper] = useState(0);
  const {
    data: hash,
    isPending,
    error,
    isError,
    isSuccess,
    writeContract,
    writeContractAsync,
  } = useWriteContract();

  console.log(address, "addressaddress");
  function calculatePercentages(input: number, calculate: number) {
    const percentage4 = (input * calculate) / 100;

    return {
      percentage4,
    };
  }
  const getToWei = (sell: string) => {
    let final = web3.utils.toWei(sell, "ether");
    console.log(final, "pppp");
    return final;
  };
  const sellFun = (e: any) => {
    const sellOutput = getToWei(e?.target?.value);
    setSell(e?.target?.value);
    const a = calculatePercentages(e.target.value, 4);
    console.log("aaaaaaaaaa", a.percentage4);
    setSellper(a.percentage4);
    console.log(sellOutput, "sellOutput", a);
  };
  console.log(receiverAddress, "receiverAddressreceiverAddress");
  const buyFun = (e: any) => {
    const a = calculatePercentages(e.target.value, 2);
    setBuy(e?.target?.value);
    setBuyper(a.percentage4);

  };
console.log(buyper,"buyperbuyper")
  const transferFun = (e: any) => {
    setTransfer(e?.target?.value);
    const a = calculatePercentages(e.target.value, 1);
    setTransferper(a.percentage4);
  };
  const { data } = useReadContract({
    address: "0x343D3fB106712c5E8095D676B117311DF359155d",
    abi: ABI,
    functionName: "owner",
  });
  console.log(address, "addresssssss");
  // const { chains, provider } = useConnections({ connectors: connectors.injected });
  // const web3Ins = new web3("https://polygon-mumbai.drpc.org");
  // const ana_ico_instance = new web3Ins.eth.Contract(
  //   ABI,
  //   "0x343D3fB106712c5E8095D676B117311DF359155d"
  // );
  console.log(sellper, "sellpersellpersellpersellpersellpersellper");
  const sellToken = async () => {
    console.log("BigInt(parseInt(sell))", selldata);
    const valueInWei = BigInt(parseInt("1000000000000000000"));
    // const valueper=parseInt(sellper)
    if (address) {
      const _amount = getToWei(selldata);
      const __amount = getToWei("0.04");
      console.log(_amount, "_amount from selll");

      if (signer) {
        console.log("Andara ghe kya ???");
        try {
          const contracts = new ethers.Contract(
            "0x343D3fB106712c5E8095D676B117311DF359155d",
            ABI,
            signer
          );
          console.log(sellper, "contracts");
          const tx = await contracts.sell(_amount, {
            value: getToWei(sellper.toString()),
            gasLimit: "20000000",
          });
          const receipt = await tx.wait();
          console.log("Transaction mined:", receipt);
        } catch (error) {
          console.error("Error casting vote:", error);
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please connect Your wallet",
      });
    }
  };

  const buyToken = async () => {
    try {
      if (address) {
        const _amount = getToWei(buydata);
        console.log(_amount,"_amount from buy")
        if (signer) {
          try {
            const contracts = new ethers.Contract(
              "0x343D3fB106712c5E8095D676B117311DF359155d",
              ABI,
              signer
            );
            const tx = await contracts.buy(_amount, {
              value: getToWei(buyper.toString()),
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
  const transferToken=async()=>{
    try {
      if(address){
        const _amount=getToWei(transfer);
        if(signer){
          console.log(_amount,"this is transfer token1111111111111")

          try {
            const contracts = new ethers.Contract(
              "0x343D3fB106712c5E8095D676B117311DF359155d",
              ABI,
              signer
              );
              console.log(contracts,"contractscontracts")
              const tx = await contracts.transfer(receiverAddress,_amount, {
                value: getToWei(transferper.toString()),
                
              });
              console.log(_amount,"this is transfer token")
          } catch (error) {
            
          }
        }
      }
    } catch (error) {
      
    }
  }
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="grid grid-cols-3 gap-4 gradient-background">
        <div className="buy border rounded p-2">
          <input
            className="border p-2 rounded"
            placeholder="Token Amount"
            type="string"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => sellFun(e)}
          />
          <button
            onClick={sellToken}
            className="relative button inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
          >
            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Sell
            </span>
          </button>
        </div>
        <div className="sell border rounded p-2">
          <input
            className="border p-2 rounded"
            placeholder="Token Amount"
            type="string"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => buyFun(e)}
          />
          <button onClick={buyToken} className="relative button inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Buy
            </span>
          </button>
        </div>
        <div className="transfer border rounded p-2">
          <input
            className="border p-2 rounded"
            placeholder="Token Amount"
            type="string"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              transferFun(e)
            }
          />
          <br/>
          <input
            className="border p-2 rounded"
            placeholder="Enter Receiver Address"
            type="string"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setReceiverAddress(e.target.value)
          }
          />
          <button onClick={transferToken} className="relative button inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Transfer
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
