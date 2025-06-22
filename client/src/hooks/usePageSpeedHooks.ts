import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getMobileScore, getDesktopScore } from '../services/api/pagespeed-api-functions';
import type { PageSpeedData } from '../types/pagespeed';
import type { LeadDataType } from '../types/lead.type';
import type { TrafficDataType } from '../types/traffic.type';
import type { SecurityDataType } from '../types/security';
import type { GenericSEOAnalysisResponse } from '../types/seo.type';

// Constants
const API_BASE_URL = 'http://localhost:3000';
const ELITE_PLAN_NAME = 'Growth Elite';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Types for cached data
interface CachedData<T> {
    data: T;
    timestamp: number;
}

interface AllCachedData {
    mobileData: PageSpeedData | null;
    desktopData: PageSpeedData | null;
    leadData: LeadDataType[] | null;
    trafficData: TrafficDataType | null;
    securityData: SecurityDataType | null;
    seoData: GenericSEOAnalysisResponse | null;
    isEliteClient: boolean;
}

// Utility functions for localStorage
const getCacheKey = (url: string) => `website_data_${url}`;

const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
};

const getCachedData = <T>(key: string): {data :T, timestamp: number} | null => {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        
        const parsedData: CachedData<T> = JSON.parse(cached);
        if (isCacheValid(parsedData.timestamp)) {
            return {data : parsedData.data, timestamp: parsedData.timestamp};
        } else {
            localStorage.removeItem(key);
            return null;
        }
    } catch (error) {
        console.error('Error reading from cache:', error);
        return null;
    }
};

const setCachedData = <T>(key: string, data: T): void => {
    try {
        const cacheData: CachedData<T> = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error writing to cache:', error);
    }
};

// Main hook that manages all data with caching using individual hooks
export const useWebsiteData = (url: string) => {
    const [shouldFetch, setShouldFetch] = useState(true);
    const [useCachedData, setUseCachedData] = useState(false);
    const [cachedAllData, setCachedAllData] = useState<AllCachedData | null>(null);
    const [timeStamp, setTimeStamp] = useState<number | null>(null);

    const cacheKey = getCacheKey(url);

    // Check cache on mount
    useEffect(() => {
        if (url) {
            const cachedData = getCachedData<AllCachedData>(cacheKey);
            if (cachedData) {
                console.log('Loading data from cache for:', url);
                setCachedAllData(cachedData.data);
                setUseCachedData(true);
                setShouldFetch(false);
                setTimeStamp(cachedData.timestamp)
            } else {
                console.log('No valid cache found, fetching fresh data for:', url);
                setUseCachedData(false);
                setShouldFetch(true);
                setTimeStamp(Date.now())
            }
        }
    }, [url, cacheKey]);

    // Use individual hooks conditionally
    const {
        mobileData: freshMobileData,
        mobileLoading,
        mobileError,
        desktopData: freshDesktopData,
        desktopLoading,
        desktopError
    } = usePageSpeedData(shouldFetch ? url : '');

    const {
        leadData: freshLeadData,
        leadLoading
    } = useLeadData(shouldFetch ? url : '');

    const {
        trafficData: freshTrafficData,
        isEliteClient: freshIsEliteClient
    } = useTrafficData(shouldFetch ? url : '');

    const {
        securityData: freshSecurityData,
        securityLoading,
        securityError
    } = useSecurityData(shouldFetch ? url : '');

    const {
        seoData: freshSeoData,
        seoLoading,
        seoError
    } = useSEOData(shouldFetch ? url : '');

    // Cache fresh data when all requests are complete
    useEffect(() => {
        if (shouldFetch && !useCachedData && url) {
            const allLoadingComplete = !mobileLoading && !desktopLoading && !leadLoading && !securityLoading && !seoLoading;
            
            if (allLoadingComplete) {
                const newData: AllCachedData = {
                    mobileData: freshMobileData,
                    desktopData: freshDesktopData,
                    leadData: freshLeadData,
                    trafficData: freshTrafficData,
                    securityData: freshSecurityData,
                    seoData: freshSeoData,
                    isEliteClient: freshIsEliteClient
                };

                // Cache the fresh data
                setCachedData(cacheKey, newData);
                console.log('Fresh data cached for:', url);
            }
        }
    }, [
        shouldFetch, useCachedData, url, cacheKey,
        mobileLoading, desktopLoading, leadLoading, securityLoading, seoLoading,
        freshMobileData, freshDesktopData, freshLeadData, freshTrafficData, 
        freshSecurityData, freshSeoData, freshIsEliteClient
    ]);

    const refetchData = useCallback(() => {
        // Clear cache and refetch
        localStorage.removeItem(cacheKey);
        setCachedAllData(null);
        setUseCachedData(false);
        setShouldFetch(true);
    }, [cacheKey]);

    // Determine which data to return
    const dataToReturn = useCachedData && cachedAllData ? cachedAllData : {
        mobileData: freshMobileData,
        desktopData: freshDesktopData,
        leadData: freshLeadData,
        trafficData: freshTrafficData,
        securityData: freshSecurityData,
        seoData: freshSeoData,
        isEliteClient: freshIsEliteClient
    };

    // Determine loading states
    const loadingStates = useCachedData ? {
        mobile: false,
        desktop: false,
        lead: false,
        traffic: false,
        security: false,
        seo: false
    } : {
        mobile: mobileLoading,
        desktop: desktopLoading,
        lead: leadLoading,
        traffic: false, // useTrafficData doesn't have loading state
        security: securityLoading,
        seo: seoLoading
    };

    // Determine error states
    const errorStates = useCachedData ? {
        mobile: false,
        desktop: false,
        lead: false,
        traffic: false,
        security: false,
        seo: false
    } : {
        mobile: mobileError,
        desktop: desktopError,
        lead: false, // useLeadData doesn't have error state
        traffic: false, // useTrafficData doesn't have error state
        security: securityError,
        seo: seoError
    };

    return {
        // Data
        mobileData: dataToReturn.mobileData,
        desktopData: dataToReturn.desktopData,
        leadData: dataToReturn.leadData,
        trafficData: dataToReturn.trafficData,
        securityData: dataToReturn.securityData,
        seoData: dataToReturn.seoData,
        isEliteClient: dataToReturn.isEliteClient,
        
        // Loading states
        mobileLoading: loadingStates.mobile,
        desktopLoading: loadingStates.desktop,
        leadLoading: loadingStates.lead,
        trafficLoading: loadingStates.traffic,
        securityLoading: loadingStates.security,
        seoLoading: loadingStates.seo,
        
        // Error states
        mobileError: errorStates.mobile,
        desktopError: errorStates.desktop,
        leadError: errorStates.lead,
        trafficError: errorStates.traffic,
        securityError: errorStates.security,
        seoError: errorStates.seo,
        
        // Actions
        refetchData,
        refetchMobile: refetchData, // Keep compatibility with existing code

        // timestamp
        timeStamp
    };
};

// Original hooks (kept for backward compatibility)
export const usePageSpeedData = (url: string) => {
    const [mobileData, setMobileData] = useState<PageSpeedData | null>(null);
    const [mobileLoading, setMobileLoading] = useState(true);
    const [mobileError, setMobileError] = useState(false);
    
    const [desktopData, setDesktopData] = useState<PageSpeedData | null>(null);
    const [desktopLoading, setDesktopLoading] = useState(true);
    const [desktopError, setDesktopError] = useState(false);

    const fetchMobileData = useCallback(async () => {
        if (!url) {
            setMobileLoading(false);
            return;
        }
        
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
        if (!url) {
            setDesktopLoading(false);
            return;
        }
        
        try {
            setDesktopLoading(true);
            setDesktopError(false);
            const desktopResponse = await getDesktopScore(url);
            setDesktopData(desktopResponse.data);
        } catch (error) {
            console.error('Error fetching desktop score:', error);
            setDesktopError(true)
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
        desktopError,
        refetchMobile: fetchMobileData,
    };
};

export const useLeadData = (url:string) => {
    const [leadData, setLeadData] = useState<LeadDataType[] | null>(null);
    const [leadLoading, setLeadLoading] = useState(true);

    useEffect(() => {
        if (!url) {
            setLeadLoading(false);
            return;
        }

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
        if (!url) return;

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
        if (!url) {
            setSecurityLoading(false);
            return;
        }

        const fetchSecurityData = async () => {
            try {
                setSecurityLoading(true)
                const response = await axios.post(`${API_BASE_URL}/security`, { url });
                    const data = response.data;
                    if(data){
                        setSecurityData(data);
                    }
            } catch (error) {
                setSecurityError(true)
                console.error('Error fetching traffic data:', error);
            }finally{
                setSecurityLoading(false)
            }
        };

        fetchSecurityData();
    }, [url]);

    return { securityData, securityLoading, securityError };
};

export const useSEOData = (url: string) => {
    const [seoData, setSeoData] = useState<GenericSEOAnalysisResponse | null>(null);
    const [seoLoading, setSeoLoading] = useState(true);
    const [seoError, setSeoError] = useState(false)

    useEffect(() => {
        if (!url) {
            setSeoLoading(false);
            return;
        }

        const fetchSeoData = async () => {
            try {
                setSeoError(false)
                setSeoLoading(true);
                const response = await axios.get('http://localhost:3000/getSEOData', {
                    params: { url }
                });
                if (response.status !== 200) {
                    throw new Error('Failed to fetch SEO data');
                }
                setSeoData(response.data.data);
            } catch (error) {
                console.error('Error fetching SEO data:', error);
                setSeoError(true)
            } finally {
                setSeoLoading(false);
            }
        };

        fetchSeoData();
    }, [url]);

    return { seoData, seoLoading, seoError };
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