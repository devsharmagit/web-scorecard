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
