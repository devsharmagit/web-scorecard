import type { LeadDataType } from "../types/lead.type";
import type { TrafficDataType } from "../types/traffic.type";

export type TabId = typeof TABS[number]['id'];

export const TABS = [
    { id: 'mobile', label: 'Mobile' },
    { id: 'desktop', label: 'Desktop' },
    { id: 'seo', label: 'SEO' },
    { id: 'traffic', label: 'Traffic' },
    { id: 'lead', label: 'Leads' },
    { id: 'security', label: 'Security' },
] as const;


// Helper function to determine if tab should be visible
export const isTabVisible = (tabId: TabId, leadData: LeadDataType[] | null, trafficData: TrafficDataType | null): boolean => {
    if (tabId === 'lead') return Boolean(leadData);
    if (tabId === 'traffic') return Boolean(trafficData);
    return true;
};

// Helper function to get tab button classes
export const getTabButtonClasses = (tabId: TabId, activeTab: TabId, leadData: LeadDataType[] | null, trafficData: TrafficDataType | null): string => {
    const baseClasses = 'flex flex-1 justify-center cursor-pointer items-center gap-2 px-6 py-4 text-sm transition-all duration-200';
    
    const activeClasses = activeTab === tabId
        ? 'bg-white border-b-2 border-[#799F92] font-semibold'
        : 'text-gray-600 border-b-2 border-gray-50 hover:text-gray-900 hover:border-[#799F92]';
    
    const visibilityClasses = isTabVisible(tabId, leadData, trafficData) ? 'flex' : 'hidden';
    
    return `${baseClasses} ${activeClasses} ${visibilityClasses}`;
};