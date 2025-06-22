import { Tooltip } from './ui/Tooltop';
import yesImageSrc from '../assets/yes.svg';
import corssImageSrc from '../assets/cross.svg';
import exclaimationImageSrc from '../assets/exclaimation.svg';
import type { GenericSEOAnalysisResponse } from '../types/seo.type';
import Loader from './ui/Loader';

const prettifyKey = (key: string): string => {
    const knownAbbreviations = ['SEO', 'URL', 'API']; // Add more as needed

    return key
        .split('_')
        .map(word => {
            const upper = word.toUpperCase();
            return knownAbbreviations.includes(upper)
                ? upper
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};


const renderValue = ( value : any ) => {
    if (Array.isArray(value)) {
        if (value.length === 0) return null;
        return (
            <div className="px-4 py-2 text-sm bg-black text-white overflow-x-auto max-w-full">
                {value.map((v, i: number) => (
                    <div key={i} className="">{String(v)}</div>
                ))}
            </div>
        );
    }
    if (typeof value === 'object' && value !== null) {
        return (
            <div className="flex flex-wrap gap-2 max-w-full">
                {Object.entries(value).map(([k]) => (
                    <span key={k} className="bg-white px-2 py-1 rounded text-base text-gray-900 ">{k}</span>
                ))}
            </div>
        );
    }
    if (typeof value === 'string' || typeof value === 'number') {
        return <span className="text-xs text-gray-700 ">{value}</span>;
    }
    return null;
};

interface BaiscSEOProps{
    data: GenericSEOAnalysisResponse | null,
    loading: boolean,
    isError: boolean
}

const BasicSEO = ({data:seoData, loading, isError}: BaiscSEOProps) => {

    if (loading) {
        return (
            <Loader text='Loading Basic SEO data... ' />
        );
    }
    if(isError){
        return (
          <div className="text-center text-red-500 py-8">
            Error fetching Basic SEO data.
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
            <h2 className="text-xl font-semibold mb-2 text-center">Basic SEO</h2>
            <div className="bg-[#F0F4F8] rounded-lg border border-[#799F92] overflow-hidden">
                {Object.entries(basicSEO).map(([key, { value, message, valid }], idx) => (
                    <div key={key} className={`px-4 py-5 ${idx !== 0 && "border-t border-[#D9E2EC]"}`}>
                        {/* Mobile: Column layout, MD+: Row layout */}
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                            {/* Heading */}
                            <div className="md:flex-1 md:max-w-[200px] md:min-w-[200px] lg:min-w-[350px] text-sm font-semibold text-[#333] flex gap-2 items-center">
                                {prettifyKey(key)}
                                {/* @ts-ignore */}
                                <Tooltip tooltipKey={key} />
                            </div>
                            
                            {/* Content section */}
                            <div className="flex-1 min-w-0">
                                <div className="flex md:flex-row gap-2 md:gap-4">
                                    {/* Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={valid === 'true' ? yesImageSrc : valid === 'false' ? corssImageSrc : exclaimationImageSrc}
                                            alt={valid === 'true' ? 'Valid' : valid === 'false' ? 'Invalid' : 'Warning'}
                                            className="w-[22px] h-[22px]"
                                        />
                                    </div>
                                    
                                    {/* Message and value */}
                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                        <div className="text-[#333] text-sm ">{message}</div>
                                        <div className="min-w-0">
                                            {renderValue(value)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Advance SEO</h2>
            <div className="bg-[#F0F4F8] rounded-lg border border-[#799F92] overflow-hidden">
                <div className="px-4 py-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:min-w-[350px] text-sm font-semibold text-[#333] flex gap-2 items-center">
                            Search Preview
                            <Tooltip tooltipKey="search_preview" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex md:flex-row gap-2 md:gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={search_preview.valid === 'true' ? yesImageSrc : search_preview.valid === 'false' ? corssImageSrc : exclaimationImageSrc}
                                        alt={search_preview.valid === 'true' ? 'Valid' : search_preview.valid === 'false' ? 'Invalid' : 'Warning'}
                                        className="w-[22px] h-[22px]"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="text-[#333] text-sm ">{search_preview.message}</div>
                                    <div className="min-w-0 overflow-hidden">
                                        <div dangerouslySetInnerHTML={{ __html: search_preview.value[0] }} />  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 border-t border-[#D9E2EC]">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:min-w-[350px] text-sm font-semibold text-[#333] flex gap-2 items-center">
                            Mobile Search Preview
                            <Tooltip tooltipKey="mobile_search_preview" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex md:flex-row gap-2 md:gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={search_preview.valid === 'true' ? yesImageSrc : search_preview.valid === 'false' ? corssImageSrc : exclaimationImageSrc}
                                        alt={search_preview.valid === 'true' ? 'Valid' : search_preview.valid === 'false' ? 'Invalid' : 'Warning'}
                                        className="w-[22px] h-[22px]"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="text-[#333] text-sm ">{search_preview.message}</div>
                                    <div className="min-w-0 overflow-hidden">
                                        <div dangerouslySetInnerHTML={{ __html: search_preview.value[0] }} />  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 border-t border-[#D9E2EC]">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:min-w-[350px] text-sm font-semibold text-[#333] flex gap-2 items-center">
                            Canonical Tag
                            <Tooltip tooltipKey="canonical_contents" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex md:flex-row gap-2 md:gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={canonical_contents.valid === 'true' ? yesImageSrc : canonical_contents.valid === 'false' ? corssImageSrc : exclaimationImageSrc}
                                        alt={canonical_contents.valid === 'true' ? 'Valid' : canonical_contents.valid === 'false' ? 'Invalid' : 'Warning'}
                                        className="w-[22px] h-[22px]"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="text-[#333] text-sm ">{canonical_contents.message}</div>
                                    <div className="min-w-0">
                                        {renderValue(canonical_contents.value)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 border-t border-[#D9E2EC]">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:min-w-[350px] text-sm font-semibold text-[#333] flex gap-2 items-center">
                            Noindex Meta
                            <Tooltip tooltipKey="noindex_description" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex md:flex-row gap-2 md:gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={noindex_description.valid === 'true' ? yesImageSrc : noindex_description.valid === 'false' ? corssImageSrc : exclaimationImageSrc}
                                        alt={noindex_description.valid === 'true' ? 'Valid' : noindex_description.valid === 'false' ? 'Invalid' : 'Warning'}
                                        className="w-[22px] h-[22px]"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="text-[#333] text-sm ">{noindex_description.message}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 border-t border-[#D9E2EC]">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:min-w-[350px] text-sm font-semibold text-[#333] flex gap-2 items-center">
                            WWW Canonicalization
                            <Tooltip tooltipKey="checkcanonicalization" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex md:flex-row gap-2 md:gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={checkcanonicalization.valid === 'true' ? yesImageSrc : checkcanonicalization.valid === 'false' ? corssImageSrc : exclaimationImageSrc}
                                        alt={checkcanonicalization.valid === 'true' ? 'Valid' : checkcanonicalization.valid === 'false' ? 'Invalid' : 'Warning'}
                                        className="w-[22px] h-[22px]"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="text-[#333] text-sm ">{checkcanonicalization.message}</div>
                                    <div className="min-w-0">
                                        {renderValue(checkcanonicalization.value)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 border-t border-[#D9E2EC]">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:min-w-[350px] text-sm font-semibold text-[#333] flex gap-2 items-center">
                            OpenGraph Meta
                            <Tooltip tooltipKey="og_contents" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex md:flex-row gap-2 md:gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={og_contents.valid === 'true' ? yesImageSrc : og_contents.valid === 'false' ? corssImageSrc : exclaimationImageSrc}
                                        alt={og_contents.valid === 'true' ? 'Valid' : og_contents.valid === 'false' ? 'Invalid' : 'Warning'}
                                        className="w-[22px] h-[22px]"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="text-[#333] text-sm ">{og_contents.message}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 border-t border-[#D9E2EC]">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:min-w-[350px] text-sm font-semibold text-[#333] flex gap-2 items-center">
                            Robots.txt
                            <Tooltip tooltipKey="robot_text_analytics" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex md:flex-row gap-2 md:gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={robot_text_analytics.valid === 'true' ? yesImageSrc : robot_text_analytics.valid === 'false' ? corssImageSrc : exclaimationImageSrc}
                                        alt={robot_text_analytics.valid === 'true' ? 'Valid' : robot_text_analytics.valid === 'false' ? 'Invalid' : 'Warning'}
                                        className="w-[22px] h-[22px]"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="text-[#333] text-sm ">{robot_text_analytics.message}</div>
                                    <div className="min-w-0">
                                        {renderValue(robot_text_analytics.value)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 border-t border-[#D9E2EC]">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:min-w-[350px] text-sm font-semibold text-[#333] flex gap-2 items-center">
                            Schema
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex md:flex-row gap-2 md:gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={checkschemameta.valid === 'true' ? yesImageSrc : checkschemameta.valid === 'false' ? corssImageSrc : exclaimationImageSrc}
                                        alt={checkschemameta.valid === 'true' ? 'Valid' : checkschemameta.valid === 'false' ? 'Invalid' : 'Warning'}
                                        className="w-[22px] h-[22px]"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="text-[#333] text-sm ">{checkschemameta.message}</div>
                                    <div className="min-w-0">
                                        {renderValue(checkschemameta.value)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BasicSEO