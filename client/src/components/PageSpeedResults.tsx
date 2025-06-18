import { useState, useEffect } from 'react';
import MobileTab from './tabs/MobileTab';
import DesktopTab from './tabs/DesktopTab';
import SEOTab from './tabs/SEOTab';
import TrafficTab from './tabs/TrafficTab';
import LeadTab from './tabs/LeadTab';
import SecurityTab from './tabs/SecurityTab';
import MainResult from './MainResult';
import { getMobileScore, getDesktopScore } from '../services/api/api-functions';
import type { PageSpeedData } from '../types/pagespeed';

const PageSpeedResults = ({ url }: { url: string }) => {
    const [activeTab, setActiveTab] = useState<
        'mobile' | 'desktop' | 'seo' | 'traffic' | 'lead' | 'security'
    >('mobile');


    const [mobileData, setMobileData] = useState<PageSpeedData | null>(null);
    const [desktopData, setDesktopData] = useState<PageSpeedData | null>(null);
    const [mobileLoading, setMobileLoading] = useState(true);
    const [desktopLoading, setDesktopLoading] = useState(true);

    const [avgScore, setAvgScore] = useState<number>(0);

    // Make concurrent API calls when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setMobileLoading(true);
                const mobileResponse = await getMobileScore(url);
                setMobileData(mobileResponse.data);
            } catch (error) {
                console.error('Error fetching mobile score:', error);
            } finally {
                setMobileLoading(false);
            }
        };

        fetchData();
    }, [url]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDesktopLoading(true);
                const mobileResponse = await getDesktopScore(url);
                setDesktopData(mobileResponse.data);
            } catch (error) {
                console.error('Error fetching mobile score:', error);
            } finally {
                setDesktopLoading(false);
            }
        };

        fetchData();
    }, [url]);

    useEffect(() =>{
      if(mobileData && desktopData) {
        const mobileScore = mobileData.lighthouseResult.categories.performance.score * 100;
        const desktopScore = desktopData.lighthouseResult.categories.performance.score * 100;
        const seoScore = mobileData.lighthouseResult.categories.seo.score * 100;

        // Calculate average score
        const average = (mobileScore + desktopScore + seoScore) / 3;
        setAvgScore(average);
      }
    }, [mobileData, desktopData]);

    const tabs = [
        { id: 'mobile', label: 'Mobile' },
        { id: 'desktop', label: 'Desktop' },
        { id: 'seo', label: 'SEO' },
        { id: 'traffic', label: 'Traffic' },
        { id: 'lead', label: 'Lead Gen' },
        { id: 'security', label: 'Security' },
    ] as const;

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <MainResult url={url} loading={mobileLoading || desktopLoading} averageScore={avgScore} />

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-gray-50">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200
              ${
                  activeTab === tab.id
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600 -mb-px'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content - All tabs are mounted but only active one is visible */}
            <div className="p-6">
                <div
                    className={`${activeTab === 'mobile' ? 'block' : 'hidden'}`}
                >
                    <MobileTab data={mobileData} loading={mobileLoading} />
                </div>

                <div
                    className={`${activeTab === 'desktop' ? 'block' : 'hidden'}`}
                >
                    <DesktopTab data={desktopData} loading={desktopLoading} />
                </div>

                <div className={`${activeTab === 'seo' ? 'block' : 'hidden'}`}>
                    <SEOTab data={mobileData} loading={mobileLoading} />
                </div>

                <div
                    className={`${activeTab === 'traffic' ? 'block' : 'hidden'}`}
                >
                    <TrafficTab />
                </div>

                <div className={`${activeTab === 'lead' ? 'block' : 'hidden'}`}>
                    <LeadTab />
                </div>

                <div
                    className={`${activeTab === 'security' ? 'block' : 'hidden'}`}
                >
                    <SecurityTab />
                </div>
            </div>
        </div>
    );
};

export default PageSpeedResults;
