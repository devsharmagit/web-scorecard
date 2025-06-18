import { Globe } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] via-[#f1fdfb] to-[#e9f7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* URL Input Section */}
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
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter a web page URL here"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#92c0b2]/30 focus:border-[#92c0b2] transition-all duration-200"
              />
              <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!urlInput.trim() || isAnalyzing}
              className="w-full mt-6 bg-[#92c0b2] hover:bg-[#7bb5a4] disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Analyzing...
                </div>
              ) : (
                'CLICK HERE FOR SCORECARD!'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
