import { useState } from 'react';
import InputForm from '../components/InputForm';
import PageSpeedResults from '../components/PageSpeedResults';

const Dashboard = () => {
    const [urlInput, setUrlInput] = useState('');
    const [showResult, setShowResult] = useState(false);

    const handleAnalyze = () => {
        if (urlInput.trim() === '') {
            alert('Please enter a valid URL');
            return;
        }
        setShowResult(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] via-[#f1fdfb] to-[#e9f7f5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
