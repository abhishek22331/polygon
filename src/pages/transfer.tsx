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
  ];
  const modalRef = useRef(null);
  const { address } = useAccount();
  const [token, setToken] = useState();
  const [transferper, setTransferper] = useState(0);
  const [transfer, setTransfer] = useState("");
  const signer = useEthersSigner();
  const [receiverAddress, setReceiverAddress] = useState<string>("");
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

  const transferToken = async () => {
    try {
      if (address) {
        const _amount = getToWei(transfer);
        if (signer) {
          console.log(_amount, "this is transfer token1111111111111");

          try {
            const contracts = new ethers.Contract(
              "0xD73924CA3386ff2c7C2F8a7A76AA0Ead4485909d",
              ABI,
              signer
            );
            console.log(contracts, "contractscontracts");
            const tx = await contracts.transfer(receiverAddress, _amount, {
              value: getToWei(transferper.toString()),
              gasLimit: "20000000",
            });
            console.log(_amount, "this is transfer token");
          } catch (error) {
            console.log("error", error);
          }
        }
      }
    } catch (error) {
      console.log("er333333333ror", error);
    }
  };
  console.log(transferper, "transferper");
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
      <div className="center wide">
        <div className="w-full text-gray">
          <div className="mx-auto fl-all-g-10">
            <div className="flex h-full flex-col justify-between ">
              <div ref={modalRef} className=" rounded-lg p-6 w50 stack-out">
                <h2 className="text-2xl mb-4">Transfer</h2>
                <h2>Tax in MATIC : {transferper ? transferper : "--"}</h2>

                <div className="mb-2">
                  <input
                    type="number"
                    value={token}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      transferFun(e)
                    }
                    placeholder="0.01"
                    className="form-textbox"
                  />
                  <br />
                  <input
                    className="form-textbox"
                    placeholder="Enter Receiver Address"
                    type="string"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setReceiverAddress(e.target.value)
                    }
                  />
                </div>
                <div>
                  <button
                    onClick={() => transferToken()}
                    className="btn btn-primary w-auto"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
