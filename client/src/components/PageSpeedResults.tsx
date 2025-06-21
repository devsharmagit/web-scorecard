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
import BasicSEO from './BasicSEO';
import axios from 'axios';
import { ArrowDownToLine } from 'lucide-react';

const PageSpeedResults = ({ url }: { url: string }) => {
    const [activeTab, setActiveTab] = useState<
        'mobile' | 'desktop' | 'seo' | 'traffic' | 'lead' | 'security'
    >('mobile');

    const [mobileData, setMobileData] = useState<PageSpeedData | null>(null);
    const [desktopData, setDesktopData] = useState<PageSpeedData | null>(null);
    const [mobileLoading, setMobileLoading] = useState(true);
    const [desktopLoading, setDesktopLoading] = useState(true);
    const [leadData, setLeadData] = useState<any>(null);
    const [leadLoading, setLeadLoading] = useState(true);
    const [trafficData, setTrafficData] = useState<any>(null);

    const [isEliteClient, setIsEliteClient] = useState<boolean>(false);

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

    useEffect(() => {
        if (mobileData && desktopData) {
            const mobileScore =
                mobileData.lighthouseResult.categories.performance.score * 100;
            const desktopScore =
                desktopData.lighthouseResult.categories.performance.score * 100;
            const seoScore =
                mobileData.lighthouseResult.categories.seo.score * 100;

            // Calculate average score
            const average = (mobileScore + desktopScore + seoScore) / 3;
            setAvgScore(average);
        }
    }, [mobileData, desktopData]);

    useEffect(() => {
        const fetchLeadData = async () => {
            try {
                setLeadLoading(true);
                const response = await axios.post(
                    'http://localhost:3000/lead',
                    { url }
                );
                if (response && response.data) {
                    // Handle lead data if needed
                    console.log('Lead Data:', response.data);
                    setLeadData(response.data.analytics);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLeadLoading(false);
            }
        };
        fetchLeadData();
    }, [url]);

    useEffect(() => {
        const fetchLeadData = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:3000/traffic',
                    { url }
                );
                if (response && response.data.data.traffic !== 'NA') {
                    // Handle lead data if needed
                    console.log('Lead Data:', response.data.data);
                    setTrafficData(response.data.data);
                    setIsEliteClient(
                        response.data.data.plan === 'Growth Elite'
                    );
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchLeadData();
    }, [url]);

    const tabs = [
        { id: 'mobile', label: 'Mobile' },
        { id: 'desktop', label: 'Desktop' },
        { id: 'seo', label: 'SEO' },
        { id: 'traffic', label: 'Traffic' },
        { id: 'lead', label: 'Leads' },
        { id: 'security', label: 'Security' },
    ] as const;

    return (
        <div className="">
            <div className="text-left mb-0 lg:mb-8 flex flex-col items-center lg:flex-row justify-between">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                    Website Scorecard
                </h2>
                <button className='flex gap-2 items-center bg-[#1F2F2F] hover:bg-[#799f92] shadow-none hover:shadow-2xl text-white font-semibold py-2 px-6 rounded-full transition-all duration-200  text-xs hover:cursor-pointer '>
                    <ArrowDownToLine height={20} width={20} /> DOWNLOAD PDF
                </button>
            </div>
            <MainResult
                url={url}
                loading={mobileLoading || desktopLoading}
                averageScore={avgScore}
            />

            {/* Tab Navigation */}
            <div className="px-0 lg:px-10">
                <div className="flex bg-white text-center sm:overflow-hidden overflow-x-scroll w-full">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
              flex flex-1 justify-center cursor-pointer items-center gap-2 px-6 py-4 text-sm transition-all duration-200
              ${
                  activeTab === tab.id
                      ? 'bg-white border-b-2 border-[#799F92]  font-semibold '
                      : 'text-gray-600 border-b-2 border-gray-50 hover:text-gray-900 hover:border-[#799F92]'
              }
              ${tab.id === 'lead' && !leadData ? 'hidden' : 'flex'}
              ${tab.id === 'traffic' && !trafficData ? 'hidden' : 'flex'}
            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content - All tabs are mounted but only active one is visible */}
            <div className="p-0 py-6 lg:px-10 ">
                <div
                    className={`${activeTab === 'mobile' ? 'block' : 'hidden'}`}
                >
                    <MobileTab
                        data={mobileData}
                        loading={mobileLoading}
                        isEliteClient={isEliteClient}
                    />
                </div>

                <div
                    className={`${activeTab === 'desktop' ? 'block' : 'hidden'}`}
                >
                    <DesktopTab
                        data={desktopData}
                        loading={desktopLoading}
                        isEliteClient={isEliteClient}
                    />
                </div>

                <div className={`${activeTab === 'seo' ? 'block' : 'hidden'}`}>
                    <SEOTab data={desktopData} loading={mobileLoading} />
                    <BasicSEO url={url} />
                </div>
                {trafficData && (
                    <div
                        className={`${activeTab === 'traffic' ? 'block' : 'hidden'}`}
                    >
                        <TrafficTab trafficData={trafficData} />
                    </div>
                )}

                {leadData && (
                    <div
                        className={`${activeTab === 'lead' ? 'block' : 'hidden'}`}
                    >
                        <LeadTab leadData={leadData} loading={leadLoading} />
                    </div>
                )}

                <div
                    className={`${activeTab === 'security' ? 'block' : 'hidden'}`}
                >
                    <SecurityTab url={url} />
                </div>
            </div>
        </div>
    );
};

export default PageSpeedResults;
