import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Inter } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Swal from "sweetalert2";
import Page from "../home/page"
import Stacking from "../home/staking"
import {
  faLinkedin,
  faSquareXTwitter,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
const inter = Inter({ subsets: ["latin"] });
// import ABI from "../../abi/abi";
import {
  useAccount,
  useReadContract,
  useTransactionConfirmations,
  useWriteContract,
} from "wagmi";
import Link from "next/link.js";
// import { ABI } from "../../abi/abi";
const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "AddressEmptyCode",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "AddressInsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FailedInnerCall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERC20Instance",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "buy",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyTaxRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "sell",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sellTaxRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "transferTaxRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export default function Home() {
  const {
    data: hash,
    isPending,
    error,
    isError,
    isSuccess,
    writeContract,
    writeContractAsync,
  } = useWriteContract();  
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const [targetPrice, setTargetPrice] = useState(null);
  const [token, setToken] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const txResult = useTransactionConfirmations({
    //@ts-ignore
    hash: txHash ? txHash : "",
  });

  console.log(txResult, "txResult");
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      //@ts-ignore
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleInputChange1 = (e: any) => {
    setToken(e.target.value);
  };

  const Continue = async (e: any) => {
    setLoading(true);
    let result;
    if (token) {
      const valueInWei = BigInt(token * 10 ** 18);
      if (address) {
        result = await writeContractAsync({
          abi: ABI,
          address: "0x343D3fB106712c5E8095D676B117311DF359155d",
          functionName: "buy",
          value: valueInWei,
        });
        //@ts-ignore
        setTxHash(result);
        setLoading(false);
        setIsOpen(false);
        Swal.fire({
          title: "Good job!",
          text: "transction done",
          icon: "success",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please connect Your wallet",
        });
      }
    }
  };

  const result = useReadContract({
    abi: ABI,
    address: "0xfCE738C9C06180B14A0E7668CF3d616F95Ac4d07",
    functionName: "targetPrice",
  });
  const Symbolresult = useReadContract({
    abi: ABI,
    address: "0xfCE738C9C06180B14A0E7668CF3d616F95Ac4d07",
    functionName: "symbol",
  });
  const Nameresult = useReadContract({
    abi: ABI,
    address: "0xfCE738C9C06180B14A0E7668CF3d616F95Ac4d07",
    functionName: "name",
  });

  useEffect(() => {
    if (result && result.data) {
      //@ts-ignore
      setTargetPrice(result.data.toString());
    }
  }, [result]);

  useEffect(() => {
    if (txResult?.isSuccess) {
      console.log(txResult?.isSuccess);
    }
  }, [txResult]);

  return (
    <>
    <div className="gradient-background">
      <main>
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
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <Link
                    href="#"
                    className="address block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="address block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Stake
                  </Link>
                </li>
                {/* <li>
                  <a
                    href="#"
                    className="address block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Services
                  </a>
                </li> */}
                {/* <li>
                  <a
                    href="#"
                    className="address block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Pricing
                  </a>
                </li> */}
              <li>
              <button className="connect-btn" onClick={() => open()}>
                  {address ? (
                    address?.substring(0, 5) + "..." + address.substring(37, 42)
                  ) : (
                    <div className="metamask-c">
                    <span>
                      Connect MetaMask</span>
                    <img src="/metamask.svg" width={30} height={30}/>
                    </div>
                  )}
                </button>
              </li>
               
              </ul>
            </div>
          </div>
        </nav>
        {/* <div className="information max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="first-div">
            <h1 className="chain">Polarfi</h1>
            <h1>
              FROST Token is a groundbreaking DeFi protocol launching on the
              Polygon Chain, designed to offer a unique blend of asset sharing,
              reward opportunities, and community-driven initiatives. By
              leveraging the power of blockchain technology, smart contracts,
              and engaging gameplay, FROST Token aims to create a sustainable
              and rewarding ecosystem for its holders. This whitepaper provides
              a comprehensive overview of the FROST Token protocol, including
              its mechanics, features, and vision for the future, with a special
              focus on the integration of an RPG game that adds value and
              engagement to the community.
            </h1>
            <div className="icons">
              <FontAwesomeIcon icon={faGlobe} size="2x" />
              <FontAwesomeIcon icon={faTelegram} size="2x" color="#25a3e2" />
              <FontAwesomeIcon icon={faSquareXTwitter} size="2x" />
              <FontAwesomeIcon icon={faLinkedin} size="2x" color="#0a66c2" />
            </div>
          </div>
          <div className="second-div">
            <div className="raised">
              {/**@ts-ignore */}
              {/* <h1>{Nameresult?.data}</h1>

              <div>
                <h2>Total Raised</h2>
                <h1 style={{ marginTop: "10px", color: "#8247e5" }}>$ 4654</h1>
              </div>
            </div>
            <div className="data">
              <div className="data1">
                <h1>Token Symbol</h1>
                <h1>Token Price</h1>
                <h1>Type</h1>
              </div>
              <div className="data2">
                {" "}
                {/**@ts-ignore */}
                {/* <h1>{Symbolresult.data}</h1>
                {/**@ts-ignore */}
                {/* {targetPrice === null ? (
                  <p>Loading...</p>
                ) : (
                  <h1>{targetPrice}</h1>
                )}
                <h1>Public</h1>
              </div> */} 
            {/* </div>
            <button
              onClick={openModal}
              className="relative button inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
            >
              <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Buy
              </span>
            </button> */}
          {/* </div>
        </div>*/}
      </main> 
      {/*{isOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full sm:w-96"
          >
            <span
              className="absolute top-0 right-0 p-2 cursor-pointer"
              onClick={closeModal}
            >
              &times;
            </span>
            <h2 className="text-2xl mb-4">Details</h2>
            <div className="mb-4">
              <input
                type="text"
                value={token}
                onChange={handleInputChange1}
                placeholder="0.01"
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>
            <button
              onClick={closeModal}
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Cancel
            </button>
            <button
              onClick={Continue}
              className="text-white px-4 py-2 rounded mr-2"
              style={{ backgroundColor: "#422647" }}
            >
              Continue
            </button>
          </div>
        </div>
      )} */}
    </div>
      {/* <Page address={address}/> */}
      
      <Stacking/>
    </>
  );
}
