import { useState } from 'react';
import MobileTab from './tabs/MobileTab';
import DesktopTab from './tabs/DesktopTab';
import SEOTab from './tabs/SEOTab';
import TrafficTab from './tabs/TrafficTab';
import LeadTab from './tabs/LeadTab';
import SecurityTab from './tabs/SecurityTab';
import MainResult from './MainResult';
import { useAverageScore, useWebsiteData } from '../hooks/usePageSpeedHooks';
import BasicSEO from './BasicSEO';
import { ArrowDownToLine } from 'lucide-react';
import { getTabButtonClasses, TABS, type TabId } from '../constants/tab';


interface PageSpeedResultsProps {
    url: string;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

const PageSpeedResults: React.FC<PageSpeedResultsProps> = ({ url }) => {
    const [activeTab, setActiveTab] = useState<TabId>('mobile');
    
    // Custom hooks for data fetching
    
    const {mobileData, mobileLoading, mobileError, 
        desktopData, desktopLoading, desktopError,
        leadData, leadLoading,
        securityData, securityLoading, securityError,
        seoData, seoLoading, seoError,
        trafficData, trafficLoading, trafficError,
        isEliteClient, timeStamp, refetchData
    } = useWebsiteData(url)

    const avgScore = useAverageScore(mobileData, desktopData);

    const isMainResultLoading = mobileLoading || desktopLoading;

    return (
        <div className="">
            {/* Header Section */}
            <div className="text-left mb-0 lg:mb-8 flex flex-col items-center lg:flex-row justify-between">
                <div className='flex flex-col mb-4 gap-2 text-center lg:text-left'>
                <h2 className="text-2xl font-medium text-gray-900">
                    Website Scorecard
                </h2>
                {timeStamp && <p className='text-sm text-gray-900'> Laste Update at : {formatDate(timeStamp)}  <span onClick={refetchData} className='text-blue-500 underline hover:cursor-pointer'> (Refresh Data)  </span> </p>}
                </div>
                <button 
                onClick={()=>console.log("clicked")}
                disabled={mobileLoading || desktopLoading || seoLoading || securityLoading || trafficLoading || leadLoading }
                className="disabled:bg-[#1F2F2F]/20 flex gap-2 items-center bg-[#1F2F2F] hover:bg-[#799f92] shadow-none hover:shadow-2xl text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 text-xs hover:cursor-pointer">
                    <ArrowDownToLine height={20} width={20} /> 
                    DOWNLOAD PDF
                </button>
            </div>

            {/* Main Result Component */}
            <MainResult
                url={url}
                loading={isMainResultLoading}
                averageScore={avgScore}
            />

            {/* Tab Navigation */}
            <div className="px-0 lg:px-10">
                <div className="flex bg-white text-center sm:overflow-hidden overflow-x-scroll w-full">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={getTabButtonClasses(tab.id, activeTab, leadData, trafficData)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-0 py-6 lg:px-10">
                {/* Mobile Tab */}
                <div className={activeTab === 'mobile' ? 'block' : 'hidden'}>
                    <MobileTab
                        data={mobileData}
                        loading={mobileLoading}
                        isEliteClient={isEliteClient}
                        isError={mobileError}
                    />
                </div>

                {/* Desktop Tab */}
                <div className={activeTab === 'desktop' ? 'block' : 'hidden'}>
                    <DesktopTab
                        data={desktopData}
                        loading={desktopLoading}
                        isEliteClient={isEliteClient}
                        isError={desktopError}
                    />
                </div>

                {/* SEO Tab */}
                <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
                    <SEOTab data={desktopData} loading={desktopLoading} isError={desktopError} />
                    <BasicSEO data={seoData} isError={seoError} loading={seoLoading} />
                </div>

                {/* Traffic Tab - Conditionally rendered */}
                {trafficData && (
                    <div className={activeTab === 'traffic' ? 'block' : 'hidden'}>
                        <TrafficTab trafficData={trafficData} loading={trafficLoading} isError={trafficError} />
                    </div>
                )}

                {/* Lead Tab - Conditionally rendered */}
                {leadData && (
                    <div className={activeTab === 'lead' ? 'block' : 'hidden'}>
                        <LeadTab leadData={leadData} loading={leadLoading} />
                    </div>
                )}

                {/* Security Tab */}
                <div className={activeTab === 'security' ? 'block' : 'hidden'}>
                    <SecurityTab data={securityData} loading={securityLoading} error={securityError} />
                </div>
            </div>
        </div>
    );
};

export default PageSpeedResults;