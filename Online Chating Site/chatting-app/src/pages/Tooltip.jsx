import React from 'react';


const Tooltip = ({ imgURL, popUpText, TickIcon = null, isCopied = false, handleIdCopy = () => {}, width, height }) => {

  return (
    <div className="copy-container relative inline-block group">
      <button onClick={handleIdCopy} className="copy-icon cursor-pointer bg-transparent border-0 size-5">
        {typeof imgURL === 'string' ? (
          <img src={imgURL} width={width} height={height} alt="tooltip icon" />
        ) : (
          React.createElement(imgURL, { width, height })
        )}
      </button>

      <span className="tooltip absolute flex items-center justify-center bg-black text-white px-2 min-h-12 border-0 font-normal font-mono rounded-md max-w-fit opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 left-8 z-10">
        {isCopied && TickIcon ? (
          <>copied{React.createElement(TickIcon, { width, height, style: { filter: 'invert(1)' } })}</>
        ) : (
          popUpText
        )}
      </span>

    </div>
  );
}

export default Tooltip;
