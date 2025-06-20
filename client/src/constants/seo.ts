import axios from "axios";
import * as cheerio from 'cheerio';

type CheerioAPI = cheerio.CheerioAPI;

interface KeywordResult {
    description: string;
    keywords: string;
}

interface MetaDescriptionResult {
    found: boolean;
    length: number;
    content: string;
}

interface HeadingResult {
    count: number;
    examples: string[];
}

interface ImageInfo {
    src: string;
    alt: string;
}

interface ImagesResult {
    total: number;
    missingAlt: number;
    missingAltPercentage: number;
    examples: ImageInfo[];
}

interface LinksResult {
    total: number;
    internal: number;
    external: number;
    ratio: string;
}

interface TitleResult {
    length: number;
    content: string;
}

interface CanonicalTagResult {
    found: boolean;
    url: string;
}

interface NoIndexResult {
    isNoIndex: boolean;
}

interface OpenGraphResult {
    found: boolean;
    count: number;
}

interface WWWCanonicalizationResult {
    hasWWW: boolean;
    recommendation: string;
    sslIssue?: boolean;
    alternativeUrl?: string;
}

interface RobotsTxtResult {
    exists: boolean;
    disallowCount?: number;
}

interface SchemaResult {
    found: boolean;
    count: number;
}

interface SearchPreviewResult {
    title: string;
    url: string;
    description: string;
    previewText: string;
}

interface SEOAnalysisResult {
    commonKeywords: KeywordResult;
    metaDescription: MetaDescriptionResult;
    headings: {
        h1: HeadingResult;
        h2: HeadingResult;
    };
    images: ImagesResult;
    links: LinksResult;
    title: TitleResult;
    metaTags: {
        canonical: CanonicalTagResult;
        noindex: NoIndexResult;
        openGraph: OpenGraphResult;
    };
    technicalSEO: {
        wwwCanonicalization: WWWCanonicalizationResult;
        robotsTxt: RobotsTxtResult;
        schemaMarkup: SchemaResult;
    };
    searchPreview: SearchPreviewResult;
    error?: string;
}

export async function analyzeSEO(url: string): Promise<SEOAnalysisResult | { error: string }> {
    try {
        const { data: html, config: { url: finalUrl } } = await fetchWithFallback(url);
        const $ = cheerio.load(html);

        return {
            commonKeywords: getCommonKeywords($),
            metaDescription: getMetaDescription($),
            headings: {
                h1: getHeadings($, 'h1'),
                h2: getHeadings($, 'h2')
            },
            images: analyzeImages($),
            links: analyzeLinks($, finalUrl || url),
            title: getTitleData($),
            metaTags: {
                canonical: getCanonicalTag($),
                noindex: checkNoIndex($),
                openGraph: checkOpenGraph($)
            },
            technicalSEO: {
                wwwCanonicalization: await checkWWWCanonicalizationAdvanced(url),
                robotsTxt: await checkRobotsTxt(finalUrl || url),
                schemaMarkup: checkSchema($)
            },
            searchPreview: generateSearchPreview($, finalUrl || url)
        };
        
    } catch (error) {
        console.error('SEO Analysis Error:', error);
        return { error: 'Failed to analyze the page' };
    }
}

async function fetchWithFallback(url: string) {
    const axiosConfig = {
        timeout: 10000,
        maxRedirects: 5,
        validateStatus: (status: number) => status < 400,
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)'
        }
    };

    try {
        // Try the original URL first
        return await axios.get(url, axiosConfig);
    } catch (error: any) {
        // Check if it's an SSL certificate error
        if (error.code === 'CERT_HAS_EXPIRED' || 
            error.message?.includes('certificate') || 
            error.message?.includes('altnames')) {
            
            // Try the alternative version (www <-> non-www)
            const alternativeUrl = url.includes('www.') 
                ? url.replace('www.', '') 
                : url.replace('://', '://www.');
            
            try {
                console.log(`SSL issue with ${url}, trying ${alternativeUrl}`);
                return await axios.get(alternativeUrl, axiosConfig);
            } catch (fallbackError) {
                // If both fail, throw the original error
                throw error;
            }
        }
        throw error;
    }
}

function getCommonKeywords($: CheerioAPI): KeywordResult {
    const text = $('body h1, body h2, body h3, body h4, body h5, body h6, body span, body p, body li').text().toLowerCase();
    const words = text.split(/\s+/).filter(word => word.length > 3);
    
    const wordCount: Record<string, number> = {};
    words.forEach(word => {
        word = word.replace(/[^a-z]/g, '');
        if (word.length > 0) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });

    const topKeywords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word)
        .join(' ');

    return {
        description: "Top 10 most frequent keywords found on the page",
        keywords: topKeywords || "No significant keywords found"
    };
}

function getMetaDescription($: CheerioAPI): MetaDescriptionResult {
    const description = $('meta[name="description"]').attr('content') || '';
    return {
        found: description.length > 0,
        length: description.length,
        content: description || 'No meta description found'
    };
}

function getHeadings($: CheerioAPI, tag: string): HeadingResult {
    const headings = $(tag).map((i, el) => $(el).text().trim()).get();
    return {
        count: headings.length,
        examples: headings.slice(0, 5)
    };
}

function analyzeImages($: CheerioAPI): ImagesResult {
    const images: ImageInfo[] = $('img').map((i, el) => ({
        src: $(el).attr('src') || '',
        alt: $(el).attr('alt') || ''
    })).get();

    const missingAlt = images.filter(img => !img.alt).length;

    return {
        total: images.length,
        missingAlt,
        missingAltPercentage: images.length > 0 ? Math.round((missingAlt / images.length) * 100) : 0,
        examples: images.filter(img => !img.alt).slice(0, 2)
    };
}

function analyzeLinks($: CheerioAPI, baseUrl: string): LinksResult {
    const links = $('a').map((i, el) => $(el).attr('href')).get().filter(Boolean);
    const domain = new URL(baseUrl).hostname;

    const internal = links.filter((href: string) => 
        href && (href.includes(domain) || href.startsWith('/') || href.startsWith('#'))
    ).length;

    return {
        total: links.length,
        internal,
        external: links.length - internal,
        ratio: links.length > 0 ? (internal / links.length * 100).toFixed(1) + '% internal' : '0% internal'
    };
}

function getTitleData($: CheerioAPI): TitleResult {
    const title = $('title').text() || '';
    return {
        length: title.length,
        content: title || 'No title found'
    };
}

function getCanonicalTag($: CheerioAPI): CanonicalTagResult {
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    return {
        found: canonical.length > 0,
        url: canonical || 'No canonical tag found'
    };
}

function checkNoIndex($: CheerioAPI): NoIndexResult {
    const robots = $('meta[name="robots"]').attr('content') || '';
    return {
        isNoIndex: robots.toLowerCase().includes('noindex')
    };
}

function checkOpenGraph($: CheerioAPI): OpenGraphResult {
    const ogTags = $('meta[property^="og:"]').length;
    return {
        found: ogTags > 0,
        count: ogTags
    };
}

async function checkWWWCanonicalizationAdvanced(url: string): Promise<WWWCanonicalizationResult> {
    const hasWWW = url.includes('www.');
    const alternativeUrl = hasWWW 
        ? url.replace('www.', '') 
        : url.replace('://', '://www.');

    const axiosConfig = {
        timeout: 5000,
        maxRedirects: 0, // Don't follow redirects to check the response
        validateStatus: () => true, // Accept all status codes
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)'
        }
    };

    try {
        // Test both versions
        const [originalResponse, alternativeResponse] = await Promise.allSettled([
            axios.get(url, axiosConfig),
            axios.get(alternativeUrl, axiosConfig)
        ]);

        let recommendation = "Ensure either www or non-www version redirects to the preferred version";
        let sslIssue = false;
        let alternativeUrlResult = undefined;

        // Check if there's an SSL issue
        if (originalResponse.status === 'rejected') {
            const error = originalResponse.reason;
            if (error.code === 'CERT_HAS_EXPIRED' || 
                error.message?.includes('certificate') || 
                error.message?.includes('altnames')) {
                sslIssue = true;
                alternativeUrlResult = alternativeUrl;
                recommendation = `SSL certificate issue detected. The certificate appears to be configured for ${hasWWW ? 'non-www' : 'www'} version only. Consider updating SSL certificate to cover both versions or redirect accordingly.`;
            }
        }

        // Check if alternative version works better
        if (alternativeResponse.status === 'fulfilled' && originalResponse.status === 'rejected') {
            recommendation += ` The ${hasWWW ? 'non-www' : 'www'} version appears to be working correctly.`;
        }

        return {
            hasWWW,
            recommendation,
            sslIssue,
            alternativeUrl: alternativeUrlResult
        };

    } catch (error) {
        return {
            hasWWW,
            recommendation: "Unable to test www canonicalization due to network issues",
            sslIssue: false
        };
    }
}

async function checkRobotsTxt(url: string): Promise<RobotsTxtResult> {
    try {
        const domain = new URL(url).origin;
        const { data } = await axios.get(`${domain}/robots.txt`, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SEO-Analyzer/1.0)'
            }
        });
        return {
            exists: true,
            disallowCount: (data.match(/Disallow:/g) || []).length
        };
    } catch (error) {
        return {
            exists: false
        };
    }
}

function checkSchema($: CheerioAPI): SchemaResult {
    const schema = $('script[type="application/ld+json"]').length;
    return {
        found: schema > 0,
        count: schema
    };
}

function generateSearchPreview($: CheerioAPI, url: string): SearchPreviewResult {
    const title = $('title').text() || 'No title';
    const description = $('meta[name="description"]').attr('content') || 'No description';
    
    return {
        title,
        url,
        description,
        previewText: `${title} - ${description.substring(0, 100)}...`
    };
}