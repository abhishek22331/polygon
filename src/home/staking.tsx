import React from "react";
import Accordion from "./Accordion";

const staking = () => {
  const accordionItems = [
    {
      title: 'Staked Amount ',
     
      rightContent: <div>0 FROST</div>,
      content: '<p>Determines whether you are using the protocol&apos;s deposit pool or being routed through secondary markets.</p><p>Note that there is a 0.05% deposit fee when minting rETH through the protocol. This fee prevents attacks around rate updates. The income from this fee is distributed to all rETH holders.</p>'
    },
    {
      title: 'Wallet Balance',
     
      rightContent: <div>0 FROST</div>,
      content: 'Paragraph 1 for Item 1. <p>Paragraph 2 for Item 1.</p>',
    },
    {
      title: 'APR Rate',
     
      rightContent: <div>1% APR</div>,
      content: '<p>rETH&apos;s APR is calculated using a 7 day average</p>',
    }
  
  ];
  return (
    <>
    <div className="max-w-screen-xl mx-auto p-4">
      {/* <div className="staking">
        <div>
          <h1 className="head_staking">Stake ETH</h1>
        </div>
        <div>
          <h1 className="head_staking">Balance: 0 ETH</h1>
        </div>
      </div> */}
    </div>
    <div className="center wide">
    <div className="w-full text-gray">
      <div className="mx-auto fl-all-g-10">
          {/* <div className="flex h-full flex-col justify-between stack-out ">
              <div className="relative">
                <div className="stack-p">
                    <div>
                    <span className="">Stake ETH</span>
                    </div>
                    <div>
                    <span className="text-xxs sm:text-base"> Balance: 0 <span>ETH</span></span>
                    <span className=" badge-purple  text-white ">Max</span>
                    </div>
                </div>
                <div className="form-box">
                  <div className="relative">
                    <span className="icon-circle icon-pos absolute"><img src="/img/eth-icon.png" alt="eth"/></span>
                    <input type="text" name="vstack" placeholder="0.00" className="form-textbox pad-left pd-r-90" />
                    <span className="group-text-right"><span className="relative -top-[1px] pr-1 text-xl sm:text-2xl">≈</span> $0.00 USD</span>
                   
                  </div>
                </div>
                <div className="text-center">
                <span className="up-down-arrow">
                      <img src="/img/updown_arrow.svg" alt="" width={24} height={24}/>
                    </span>
                </div>
               
              </div>
          </div> */}
          <div className="flex h-full flex-col justify-between stack-out ">
              <div className="relative">
                <div className="stack-p">
                    <div>
                    <span className="">Stake FROST</span>
                    </div>
                    <div>
                    <span className="text-xxs sm:text-base"> Balance: 0.00 <span>Matic</span></span>
                   
                    </div>
                </div>
                <div className="form-box">
                  <div className="relative">
                    <span className="icon-circle icon-pos absolute"><img src="/img/eth-icon.png" alt="eth"/></span>
                    <input type="text" name="vstack" placeholder="Enter the amount in FROST" className="form-textbox pad-left pd-r-90" />
                    <span className="group-text-right t-pos"> <button className="badge-purple badge-max text-white ">Max</button></span>
                   
                  </div>
                </div>
                                 
                <Accordion items={accordionItems} />
                <div>
                <div className="acc-title border-b-none">

                    <strong style={{ flex: 2 }}>Reward Balance</strong>
                                <div style={{ flex: 1, textAlign: 'right' }} className='right-c'>1 Matic <button disabled className='badge-lt-grey'>Claim</button></div>

                    </div>
                    {/* <div className="acc-text">
                       <div className="ms-auto">@ 27 gwei <span className='badge-green'>Claim</span></div> 
                    </div> */}
                </div>
              </div>
          </div>
          <div className="mb-4">
            <button className="btn btn-primary">Connect</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default staking;
