import React, { useState } from 'react'
import dashboarImg from "../assets/dashboard-monitor.png"

interface InputFormProps {
  urlInput: string;
  setUrlInput: React.Dispatch<React.SetStateAction<string>>;
  handleAnalyze: () => void;
}

const InputForm = ({urlInput, setUrlInput, handleAnalyze}: InputFormProps) => {
     const [isUrlValid, setIsUrlValid] = useState(false);
    
      const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        if(newUrl.trim().startsWith('http://') || newUrl.trim().startsWith('https://')) {
          setIsUrlValid(true);
        } else {
          setIsUrlValid(false);
        }
        setUrlInput(newUrl);
      };
  return (
     <div className="">
          <div className="text-left mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Website Scorecard</h2>
          </div>
          <div className="max-w-xl mx-auto text-center">
              <img src={dashboarImg} alt="Dashboard" className="w-[90px] h-[90px] mx-auto mb-4" />
            <div className="relative">
              <input
                type="url"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder="Enter a web page URL here"
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-sm focus:shadow  transition-all duration-200"
              />
            </div>
            <p className=" text-sm text-black font-semibold mt-4">
              Unlock valuable insights into your website's performance with our comprehensive analytics report. 
              Monitor key metrics such as page load speed, SEO score, traffic sources, and user engagement.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={isUrlValid ? false : true}
              className=" mt-6 bg-[#1F2F2F] hover:bg-[#799f92] hover:shadow-2xl text-white font-semibold py-2 px-6 rounded-full transition-all duration-200  text-xs mx-auto "
            >
              CLICK HERE FOR SCORECARD!
            </button>
          </div>
        </div>
  )
}

export default InputForm