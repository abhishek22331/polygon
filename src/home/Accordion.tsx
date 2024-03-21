import React, { useState } from 'react';
interface AccordionItem {
  title: string;
   rightContent: React.ReactNode;
  content: string;
}

function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState(null);

  // const toggleAccordion = (index:any) => {
  //   setOpenIndex(openIndex === index ? null : index);
  // };
  const toggleAccordion = (index:any) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    // <div>
    //   {items.map((item:any, index:any) => (
    //     <div key={index}>
    //       <div
    //         onClick={() => toggleAccordion(index)}
    //         style={{ cursor: 'pointer', marginBottom: '5px' }}
    //       >
    //         <strong>{item.title}</strong>
    //       </div>
    //       {openIndex === index && (
    //         <div style={{ marginLeft: '10px' }}>{item.content}</div>
    //       )}
    //     </div>
    //   ))}
    // </div>
    <div>
    {items.map((item, index) => (
      <div key={index}>

<div
            // onClick={() => toggleAccordion(index)} 
            // please uncomment above if accordion needed
            style={{ cursor: 'pointer', marginBottom: '5px' }}
          className='acc-title'
          >
           
            <strong style={{ flex: 2 }}>{item.title}</strong>
            <div style={{ flex: 1, textAlign: 'right' }} className='right-c'>{item.rightContent}</div>
       
        
          {/* {openIndex === index ? (
            <span>&#x1F869;</span> // Down arrow
          ) : (
            <span> &#129131;</span> // Right arrow
          )} */}
        </div>
        {openIndex === index && (
          <div  className='acc-content' 
          
          > <div dangerouslySetInnerHTML={{ __html: item.content }} /></div>
        )}
      </div>
    ))}
  </div>
  );
}



export default Accordion;
