import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InputForm from '../components/InputForm';
import PageSpeedResults from '../components/PageSpeedResults';

const Dashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [urlInput, setUrlInput] = useState('');
    const [showResult, setShowResult] = useState(false);
    console.log({urlInput})

    // Get URL from query parameters on component mount
    useEffect(() => {
        const urlFromParams = searchParams.get('url');
        if (urlFromParams) {
            setUrlInput(urlFromParams);
            setShowResult(true);
        }
    }, [searchParams]);

    const handleAnalyze = () => {
        if (urlInput.trim() === '') {
            alert('Please enter a valid URL');
            return;
        }
        
        let processedUrl = urlInput.trim();
        console.log({processedUrl});
        
        // Add protocol if missing
        if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
            processedUrl = `https://${processedUrl}`;
        }
        
        // Update URL input to processed URL
        setUrlInput(processedUrl);
        
        // Set search params with processed URL
        setSearchParams({ url: processedUrl });
        setShowResult(true);
    };

    return (
        <div className="min-h-[90vh] bg-gradient-to-br from-[#f9f9f9] via-[#f1fdfb] to-[#e9f7f5] px-4 py-4">
            <div className="h-full min-h-[90vh] mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                {/* URL Input Section */}
                {!showResult && 
                    <InputForm
                        urlInput={urlInput}
                        setUrlInput={setUrlInput}
                        handleAnalyze={handleAnalyze}
                    />
                }

                {showResult && <PageSpeedResults url={urlInput} />}
            </div>
        </div>
    );
};

export default Dashboard;