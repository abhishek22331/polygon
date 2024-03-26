import Link from "next/link";
import React, { useRef, useState } from "react";
import web3 from "web3";
import { useEthersSigner } from "../../config/ether";
import { BigNumber, ethers } from "ethers";
import {
  useAccount,
  useReadContract,
  useTransactionConfirmations,
  useWriteContract,
} from "wagmi";
import Swal from "sweetalert2";
const sell = () => {
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
  const signer = useEthersSigner();
  const { address } = useAccount();
  const [token, setToken] = useState();
  const [selldata, setSell] = useState("");
  const [sellper, setSellper] = useState(0);
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
  const handleInputChange1 = (e: any) => {
    setToken(e.target.value);
  };
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
            "0xb10C3BE52bC95EF9c347AbEf41d11bDB0546cB28",
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
      <div className="bg-white rounded-lg p-6 w-full sm:w-96">
        <h2 className="text-2xl mb-4">Sell</h2>
        <h2>Tax in MATIC : {sellper ? sellper : "--"}</h2>
        <div className="mb-4">
          <input
            type="text"
            value={token}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => sellFun(e)}
            placeholder="0.01"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>

        <button
          onClick={sellToken}
          className="text-white px-4 py-2 rounded mr-2"
          style={{ backgroundColor: "#422647" }}
        >
          Continue
        </button>
      </div>
      {/* <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
      
      </div> */}
      {/* <button
        // onClick={openModal}
        className="relative button inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
      >
        <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Buy
        </span>
      </button> */}
    </div>
  );
};

export default sell;
