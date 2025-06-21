import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getMobileScore, getDesktopScore } from '../services/api/pagespeed-api-functions';
import type { PageSpeedData } from '../types/pagespeed';
import type { LeadDataType } from '../types/lead.type';
import type { TrafficDataType } from '../types/traffic.type';
import type { SecurityDataType } from '../types/security';

// Constants
const API_BASE_URL = 'http://localhost:3000';
const ELITE_PLAN_NAME = 'Growth Elite';

export const usePageSpeedData = (url: string) => {
    const [mobileData, setMobileData] = useState<PageSpeedData | null>(null);
    const [mobileLoading, setMobileLoading] = useState(true);
    const [mobileError, setMobileError] = useState(false);
    
    const [desktopData, setDesktopData] = useState<PageSpeedData | null>(null);
    const [desktopLoading, setDesktopLoading] = useState(true);

    const fetchMobileData = useCallback(async () => {
        try {
            setMobileError(false);
            setMobileLoading(true);
            const mobileResponse = await getMobileScore(url);
            setMobileData(mobileResponse.data);
        } catch (error) {
            console.error('Error fetching mobile score:', error);
            setMobileError(true);
        } finally {
            setMobileLoading(false);
        }
    }, [url]);

    const fetchDesktopData = useCallback(async () => {
        try {
            setDesktopLoading(true);
            const desktopResponse = await getDesktopScore(url);
            setDesktopData(desktopResponse.data);
        } catch (error) {
            console.error('Error fetching desktop score:', error);
        } finally {
            setDesktopLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchMobileData();
    }, [fetchMobileData]);

    useEffect(() => {
        fetchDesktopData();
    }, [fetchDesktopData]);

    return {
        mobileData,
        mobileLoading,
        mobileError,
        desktopData,
        desktopLoading,
        refetchMobile: fetchMobileData,
    };
};

export const useLeadData = (url:string) => {
    const [leadData, setLeadData] = useState<LeadDataType[] | null>(null);
    const [leadLoading, setLeadLoading] = useState(true);

    useEffect(() => {
        const fetchLeadData = async () => {
            try {
                setLeadLoading(true);
                const response = await axios.post(`${API_BASE_URL}/lead`, { url });
                
                if (response?.data?.analytics) {
                    setLeadData(response.data.analytics);
                }
            } catch (error) {
                console.error('Error fetching lead data:', error);
            } finally {
                setLeadLoading(false);
            }
        };

        fetchLeadData();
    }, [url]);

    return { leadData, leadLoading };
}

export const useTrafficData = (url: string) => {
    const [trafficData, setTrafficData] = useState<TrafficDataType | null>(null);
    const [isEliteClient, setIsEliteClient] = useState<boolean>(false);

    useEffect(() => {
        const fetchTrafficData = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/traffic`, { url });
                
                if (response?.data?.data?.traffic !== 'NA') {
                    const data = response.data.data;
                    setTrafficData(data);
                    setIsEliteClient(data.plan === ELITE_PLAN_NAME);
                }
            } catch (error) {
                console.error('Error fetching traffic data:', error);
            }
        };

        fetchTrafficData();
    }, [url]);

    return { trafficData, isEliteClient };
};

export const useSecurityData = (url: string) => {
    const [securityData, setSecurityData] = useState<SecurityDataType | null>(null);
    const [securityLoading, setSecurityLoading] = useState(false);
    const [securityError, setSecurityError] = useState(false);

    useEffect(() => {
        const fetchTrafficData = async () => {
            try {
                setSecurityLoading(true)
                const response = await axios.post(`${API_BASE_URL}/security`, { url });
                    const data = response.data.data;
                    setSecurityData(data);
            } catch (error) {
                console.error('Error fetching traffic data:', error);
                setSecurityError(true)
            }finally{
                setSecurityLoading(false)
            }
        };

        fetchTrafficData();
    }, [url]);

    return { securityData, securityLoading, securityError };
};

export const useAverageScore = (mobileData: PageSpeedData | null, desktopData: PageSpeedData | null) => {
    const [avgScore, setAvgScore] = useState<number>(0);

    useEffect(() => {
        if (mobileData && desktopData) {
            const mobileScore = mobileData.lighthouseResult.categories.performance.score * 100;
            const desktopScore = desktopData.lighthouseResult.categories.performance.score * 100;
            const seoScore = mobileData.lighthouseResult.categories.seo.score * 100;

            const average = (mobileScore + desktopScore + seoScore) / 3;
            setAvgScore(average);
        }
    }, [mobileData, desktopData]);

    return avgScore;
}; 