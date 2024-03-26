import Link from "next/link";
import React, { useRef, useState } from "react";
import {
  useAccount,
  useReadContract,
  useTransactionConfirmations,
  useWriteContract,
} from "wagmi";
import web3 from "web3";
import { useEthersSigner } from "../../config/ether";
import { BigNumber, ethers } from "ethers";
const Transfer = () => {
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
          outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
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
  const modalRef = useRef(null);
  const { address } = useAccount();
  const [token, setToken] = useState();
  const [transferper, setTransferper] = useState(0);
  const [transfer, setTransfer] = useState("");
  const signer = useEthersSigner();
  const [receiverAddress, setReceiverAddress] = useState<string>('');
  function calculatePercentages(input: number, calculate: number) {
    const percentage4 = (input * calculate) / 100;

    return {
      percentage4,
    };
  }
  const transferFun = (e: any) => {
    setTransfer(e?.target?.value);
    const a = calculatePercentages(e.target.value, 1);
    setTransferper(a.percentage4);
  };
  const getToWei = (sell: string) => {
    let final = web3.utils.toWei(sell, "ether");
    console.log(final, "pppp");
    return final;
  };
  
  const transferToken=async()=>{
    try {
      if(address){
        const _amount=getToWei(transfer);
        if(signer){
          console.log(_amount,"this is transfer token1111111111111")

          try {
            const contracts = new ethers.Contract(
              "0xb10C3BE52bC95EF9c347AbEf41d11bDB0546cB28",
              ABI,
              signer
              );
              console.log(contracts,"contractscontracts")
              const tx = await contracts.transfer(receiverAddress,_amount, {
                value: getToWei(transferper.toString()),
                gasLimit: "20000000",
              });
              console.log(_amount,"this is transfer token")
          } catch (error) {
            console.log("error",error)
          }
        }
      }
    } catch (error) {
        console.log("er333333333ror",error)
      
    }
  }
  console.log(transferper,"transferper")
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="/polygon.svg" style={{ maxWidth: "20%" }} />
            <span className="address self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Polarfi
            </span>
          </Link>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  href="/"
                  className="address block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  className="address block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Sell
                </Link>
              </li>
              <li>
                <Link
                  href="/buy"
                  className="address block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Buy
                </Link>
              </li>{" "}
              <li>
                <Link
                  href="/transfer"
                  className="address block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Transfer
                </Link>
              </li>
              <li>
                <button className="connect-btn" onClick={() => open()}>
                  {address ? (
                    address?.substring(0, 5) + "..." + address.substring(37, 42)
                  ) : (
                    <div className="metamask-c">
                      <span>Connect Wallet</span>
                    </div>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-full sm:w-96">
        <h2 className="text-2xl mb-4">Transfer</h2>
        <h2>Tax in MATIC : {transferper?transferper:"--"}</h2>

        <div className="mb-4">
          <input
            type="text"
            value={token}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                transferFun(e)
              }
            placeholder="0.01"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
           <br/>
          <input
            className="border border-gray-300 rounded px-4 py-2 w-full"
            placeholder="Enter Receiver Address"
            type="string"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setReceiverAddress(e.target.value)
          }
          />
        </div>

        <button
          onClick={()=>transferToken()}
          className="text-white px-4 py-2 rounded mr-2"
          style={{ backgroundColor: "#422647" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Transfer;
