import React, { useState } from 'react'
import dashboarImg from "../assets/dashboard-monitor.png"

interface InputFormProps {
  urlInput: string;
  setUrlInput: React.Dispatch<React.SetStateAction<string>>;
  handleAnalyze: () => void;
}

const InputForm = ({urlInput, setUrlInput, handleAnalyze}: InputFormProps) => {
  const [urlError, setUrlError] = useState('');
  
  const isValidDomain = (url: string) => {
    // Basic domain validation pattern - must have at least one dot and valid characters
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    const subdomainPattern = /^([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}$/;
    
    return domainPattern.test(url) || subdomainPattern.test(url);
  };
  
  const validateUrl = (inputValue: string) => {
    if (!inputValue.trim()) {
      return { isValid: false, error: 'Please enter a URL' };
    }
    
    const trimmedValue = inputValue.trim();
    
    // If it starts with http:// or https://, validate the full URL
    if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
      try {
        const url = new URL(trimmedValue);
        // Check if the hostname has at least one dot (valid domain)
        if (url.hostname.includes('.') && isValidDomain(url.hostname)) {
          return { isValid: true, error: '' };
        } else {
          return { isValid: false, error: 'Please enter a valid URL with a proper domain (e.g., https://example.com)' };
        }
      } catch {
        return { isValid: false, error: 'Please enter a valid URL' };
      }
    } else {
      // Check if it looks like a domain (contains at least one dot and valid characters)
      if (isValidDomain(trimmedValue)) {
        return { isValid: true, error: '' };
      } else {
        return { isValid: false, error: 'Please enter a valid URL or domain (e.g., example.com)' };
      }
    }
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUrlInput(inputValue);
    // Clear error when user starts typing
    if (urlError) {
      setUrlError('');
    }
  };
  
  const handleButtonClick = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validation = validateUrl(urlInput);
    
    if (validation.isValid) {
      // Process the URL to ensure it has protocol
      let processedUrl = urlInput.trim();
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
        setUrlInput(processedUrl);
      }
      setUrlError('');
      handleAnalyze();
    } else {
      setUrlError(validation.error);
    }
  };
  
  return (
    <div className="">
      <div className="text-left mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Website Scorecard</h2>
      </div>
      <div className="max-w-xl mx-auto text-center">
        <img src={dashboarImg} alt="Dashboard" className="w-[90px] h-[90px] mx-auto mb-4" />
        <div className="relative">
       <form onSubmit={handleButtonClick}>
          <input
            type="url"
            value={urlInput}
            onChange={handleUrlChange}
            placeholder="Enter a web page URL here"
            className={`w-full px-3 py-2 text-sm border-2 rounded-sm focus:shadow transition-all duration-200 ${
              urlError ? 'border-red-500' : 'border-gray-200 focus:border-gray-400'
            }`}
          />
          {urlError && (
            <p className="text-red-500 text-xs mt-1 text-left">{urlError}</p>
          )}
        
        <p className="text-sm text-black font-semibold mt-4">
          Unlock valuable insights into your website's performance with our comprehensive analytics report. 
          Monitor key metrics such as page load speed, SEO score, traffic sources, and user engagement.
        </p>

        <button
          type='submit'
          className={`mt-6 font-semibold py-2 px-6 rounded-full transition-all duration-200 text-xs mx-auto bg-[#1F2F2F] hover:bg-[#799f92] hover:shadow-2xl text-white cursor-pointer`}
        >
          CLICK HERE FOR SCORECARD!
        </button>
       </form>
        </div>
      </div>
    </div>
  )
}

export default InputForm