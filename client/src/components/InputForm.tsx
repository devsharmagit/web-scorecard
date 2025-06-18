import { Globe } from 'lucide-react'
import React, { useState } from 'react'

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
     <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e0f2ee] rounded-2xl mb-4">
              <Globe className="w-8 h-8 text-[#92c0b2]" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Website Performance Analyzer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlock valuable insights into your website's performance with our comprehensive analytics report. 
              Monitor key metrics such as page load speed, SEO score, traffic sources, and user engagement.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="url"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder="Enter a web page URL here"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#92c0b2]/30 focus:border-[#92c0b2] transition-all duration-200"
              />
              <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isUrlValid ? false : true}
              className="w-full mt-6 bg-[#92c0b2] hover:bg-[#7bb5a4] disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            >
              CLICK HERE FOR SCORECARD!
            </button>
          </div>
        </div>
  )
}

export default InputForm