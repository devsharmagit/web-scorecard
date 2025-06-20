import React, { useEffect, useState } from 'react'
import { Loader2,  CircleCheck, CircleX, CircleAlert } from 'lucide-react';
import axios from 'axios';

const prettifyKey = (key: string) => {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
};

const renderValue = (value: any) => {
    if (Array.isArray(value)) {
        if (value.length === 0) return null;
        return (
            <div className="px-4 py-2 text-sm bg-black text-white overflow-x-scroll ">
                {value.map((v: any, i: number) => (
                    <div key={i} className="">{String(v)}</div>
                ))}
            </div>
        );
    }
    if (typeof value === 'object' && value !== null) {
        return (
            <div className="flex flex-wrap gap-2">
                {Object.entries(value).map(([k]: [string, any]) => (
                    <span key={k} className="bg-white px-2 py-1 rounded text-base text-gray-900">{k}</span>
                ))}
            </div>
        );
    }
    if (typeof value === 'string' || typeof value === 'number') {
        return <span className="text-xs text-gray-700">{value}</span>;
    }
    return null;
};

const BasicSEO = ({url}: {url: string}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [seoData, setSeoData] = useState<any>(null);

    console.log(seoData)

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching SEO data for URL:', url);
                setLoading(true);
                const response = await axios.get('http://localhost:3000/getSEOData', {
                    params: { url }
                });
                console.log('SEO data response:', response)
                if (response.status !== 200) {
                    throw new Error('Failed to fetch SEO data');
                }
                setSeoData(response.data.data);
            } catch (error) {
                console.error('Error fetching SEO data:', error);
            } finally {
                setLoading(false);
            }
        };
        if(url){
            fetchData();
        }
    }, [url]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                <span className="ml-2 text-gray-600">Analyzing basic SEO metrics...</span>
            </div>
        );
    }

    if (!seoData) {
        return (
            <div className="text-center text-gray-500 py-8">
                No SEO data available
            </div>
        );
    }

    const basicSEO = seoData.advance_seo?.basic_seo || {};

    const advanceSEO = seoData.advance_seo?.advance_seo || {};

    // const {keyword_contents, seo_description, h1_contents, h2_contents, alt_contents, match_keyword_to_meta, link_contents, seo_title} = basicSEO;

    const { search_preview, canonical_contents, noindex_description, checkcanonicalization, og_contents, robot_text_analytics, checkschemameta } = advanceSEO

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Basic SEO</h2>
            <div className="bg-[#f0f4f8] rounded-lg shadow border border-[#799F92] divide-y">
                {Object.entries(basicSEO).map(([key, { value, message, valid }]: any, idx) => (
                    <div key={key} className="flex items-start justify-between px-4 py-5">
                        <div className="min-w-[350px] font-semibold text-gray-900 text flex items-center">{prettifyKey(key)}</div>
                          <div className="mr-4 flex items-center">
                            {valid === 'true' ? (
                                <CircleCheck  className="text-green-500 w-6 h-6" />
                            ) : valid === 'false' ? (
                                <CircleX className="text-red-500 w-6 h-6" />
                            ) : (
                                <CircleAlert className="text-blue-500 w-6 h-6" />
                            )}
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-1">
                            <div className="text-[#333] bg-b font-semibold mb-1">{message}</div>
                            {renderValue(value)}
                        </div>
                      
                    </div>
                ))}
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center">Advance SEO</h2>
              <div className="bg-[#f0f4f8] rounded-lg shadow border border-[#799F92] divide-y">
                    <div className="flex items-start justify-between px-4 py-5">
                        <div className="min-w-[350px] font-semibold text-gray-900 text flex items-center">
                            Search Preview
                        </div>
                        <div className="mr-4 flex items-center">
                            {search_preview.valid === 'true' ? (
                                <CircleCheck  className="text-green-500 w-6 h-6" />
                            ) : search_preview.valid === 'false' ? (
                                <CircleX className="text-red-500 w-6 h-6" />
                            ) : (
                                <CircleAlert className="text-blue-500 w-6 h-6" />
                            )}
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-1">
                            <div className="text-[#333] bg-b font-semibold mb-1">{search_preview.message}</div>
                            <div dangerouslySetInnerHTML={{ __html: search_preview.value }} />  
                        </div>
                    </div>
                    <div className="flex items-start justify-between px-4 py-5">
                        <div className="min-w-[350px] font-semibold text-gray-900 text flex items-center">
                            Mobile Search Preview
                        </div>
                         <div className="mr-4 flex items-center">
                            {search_preview.valid === 'true' ? (
                                <CircleCheck  className="text-green-500 w-6 h-6" />
                            ) : search_preview.valid === 'false' ? (
                                <CircleX className="text-red-500 w-6 h-6" />
                            ) : (
                                <CircleAlert className="text-blue-500 w-6 h-6" />
                            )}
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-1">
                            <div className="text-[#333] bg-b font-semibold mb-1">{search_preview.message}</div>
                            <div dangerouslySetInnerHTML={{ __html: search_preview.value }} />  
                        </div>
                    </div>
                    <div className="flex items-start justify-between px-4 py-5">
                        <div className="min-w-[350px] font-semibold text-gray-900 text flex items-center">
                            Canonical Tag
                        </div>
                         <div className="mr-4 flex items-center">
                            {canonical_contents.valid === 'true' ? (
                                <CircleCheck  className="text-green-500 w-6 h-6" />
                            ) : canonical_contents.valid === 'false' ? (
                                <CircleX className="text-red-500 w-6 h-6" />
                            ) : (
                                <CircleAlert className="text-blue-500 w-6 h-6" />
                            )}
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-1">
                            <div className="text-[#333] bg-b font-semibold mb-1">{canonical_contents.message}</div>
                            <div className="text-gray-700 font-semibold text-base">
                {canonical_contents.value.map((v: string, ) => v)}  </div>
                        </div>
                    </div>
                     <div className="flex items-start justify-between px-4 py-5">
                        <div className="min-w-[350px] font-semibold text-gray-900 text flex items-center">
                            Noindex Meta
                        </div>
                         <div className="mr-4 flex items-center">
                            {noindex_description.valid === 'true' ? (
                                <CircleCheck  className="text-green-500 w-6 h-6" />
                            ) : noindex_description.valid === 'false' ? (
                                <CircleX className="text-red-500 w-6 h-6" />
                            ) : (
                                <CircleAlert className="text-blue-500 w-6 h-6" />
                            )}
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-1">
                            <div className="text-[#333] bg-b font-semibold mb-1">{noindex_description.message}</div>
                            
                        </div>
                    </div>
                     <div className="flex items-start justify-between px-4 py-5">
                        <div className="min-w-[350px] font-semibold text-gray-900 text flex items-center">
                            WWW Canonicalization
                        </div>
                         <div className="mr-4 flex items-center">
                            {checkcanonicalization.valid === 'true' ? (
                                <CircleCheck  className="text-green-500 w-6 h-6" />
                            ) : checkcanonicalization.valid === 'false' ? (
                                <CircleX className="text-red-500 w-6 h-6" />
                            ) : (
                                <CircleAlert className="text-blue-500 w-6 h-6" />
                            )}
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-1">
                            <div className="text-[#333] bg-b font-semibold mb-1">{checkcanonicalization.message}</div>
                            
                        </div>
                    </div>
                  
                     <div className="flex items-start justify-between px-4 py-5">
                        <div className="min-w-[350px] font-semibold text-gray-900 text flex items-center">
                            OpenGraph Meta
                        </div>
                         <div className="mr-4 flex items-center">
                            {og_contents.valid === 'true' ? (
                                <CircleCheck  className="text-green-500 w-6 h-6" />
                            ) : og_contents.valid === 'false' ? (
                                <CircleX className="text-red-500 w-6 h-6" />
                            ) : (
                                <CircleAlert className="text-blue-500 w-6 h-6" />
                            )}
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-1">
                            <div className="text-[#333] bg-b font-semibold mb-1">{og_contents.message}</div>
                            
                        </div>
                    </div>
                       <div className="flex items-start justify-between px-4 py-5">
                        <div className="min-w-[350px] font-semibold text-gray-900 text flex items-center">
                            Robots.txt
                        </div>
                         <div className="mr-4 flex items-center">
                            {robot_text_analytics.valid === 'true' ? (
                                <CircleCheck  className="text-green-500 w-6 h-6" />
                            ) : robot_text_analytics.valid === 'false' ? (
                                <CircleX className="text-red-500 w-6 h-6" />
                            ) : (
                                <CircleAlert className="text-blue-500 w-6 h-6" />
                            )}
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-1">
                            <div className="text-[#333] bg-b font-semibold mb-1">{robot_text_analytics.message}</div>
                            
                        </div>
                    </div>
                     <div className="flex items-start justify-between px-4 py-5">
                        <div className="min-w-[350px] font-semibold text-gray-900 text flex items-center">
                            Schema
                        </div>
                         <div className="mr-4 flex items-center">
                            {checkschemameta.valid === 'true' ? (
                                <CircleCheck  className="text-green-500 w-6 h-6" />
                            ) : checkschemameta.valid === 'false' ? (
                                <CircleX className="text-red-500 w-6 h-6" />
                            ) : (
                                <CircleAlert className="text-blue-500 w-6 h-6" />
                            )}
                        </div>
                        <div className="overflow-hidden flex-1 flex flex-col gap-1">
                            <div className="text-[#333] bg-b font-semibold mb-1">{checkschemameta.message}</div>
                            
                        </div>
                    </div>
              </div>
                
        </div>
    );
}

export default BasicSEO