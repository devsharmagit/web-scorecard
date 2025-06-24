import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
}

const InfoTooltip = ({ title }: InfoTooltipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTooltipContent = (title: string) => {
    switch (title) {
      case 'Mobile Performance':
        return {
          represents: "This score reflects how well your website performs on mobile devices in terms of speed, responsiveness, and user experience.",
          dataSource: "We derive this data directly from Google PageSpeed Insights and Lighthouse—Google's official performance audit tools.",
          importance: "Most users access websites via mobile devices. A fast, well-optimized mobile experience reduces bounce rates, boosts engagement, and improves conversion rates.",
          whyHigh: "Google considers mobile performance a key factor in search rankings. Poor mobile performance can negatively impact your visibility, user satisfaction, and lead generation.",
          reliable: "Unlike many third-party tools that use approximations or synthetic test environments, this score comes from Google's own benchmarking tools. Since Google sets the performance standards for indexing and ranking, this gives you the most reliable and authoritative insight into how your mobile site truly performs."
        };
      
      case 'Desktop Performance':
        return {
          represents: "This score reflects how your website performs on desktop devices, including page load speed, interactivity, visual stability, and technical optimization.",
          dataSource: "We use performance data from Google PageSpeed Insights and Lighthouse, both industry-standard tools developed by Google to evaluate desktop website performance.",
          importance: "Desktop visitors often expect high-speed and seamless interactions, especially for professional, B2B, or detailed content browsing. A strong desktop performance ensures better user experience, reduced friction, and higher engagement.",
          whyHigh: "A high-performing desktop site supports your brand's credibility and can positively influence search rankings, conversions, and user retention, especially when users are on stable connections and expect quick response times.",
          reliable: "Unlike tools that rely on third-party estimations, our platform delivers scores based on Google's own performance auditing standards. This ensures greater accuracy and alignment with real-world expectations, particularly those that influence Google's indexing and ranking systems."
        };
      
      case 'Search Engine Optimization Score':
        return {
          represents: "This score measures how effectively your website is optimized for search engines like Google. It includes checks across both basic SEO (like meta tags and heading structure) and advanced SEO (like schema markup, canonical tags, and OpenGraph settings).",
          dataSource: "We use Google PageSpeed Insights and Lighthouse to fetch real-time SEO data. These tools evaluate technical elements of your website against Google's best practices for visibility and ranking.",
          importance: "SEO directly affects how easily your website can be found on Google and other search engines. A well-optimized site ensures your pages are properly indexed, your content is understood, and your metadata is aligned with how people search.",
          whyHigh: "A high SEO score means your site is following Google's latest optimization guidelines, which leads to better rankings, increased organic traffic, and more qualified leads. Even small improvements here can significantly boost discoverability.",
          reliable: "Unlike tools that only run basic SEO checks, we break down each critical aspect—such as indexing rules, meta titles/descriptions, heading structure, internal/external links, image alt tags, keyword mapping, canonical tags, robots.txt, schema, and more. All of this is based on Google's own Lighthouse framework, making our insights more actionable and in line with how search engines evaluate your site."
        };
      
      case 'Security':
        return {
          represents: "This score assesses your website's security posture, including how well it safeguards user data and prevents unauthorized access or vulnerabilities. It covers areas like secure connections, header protections, access control, and sensitive file visibility.",
          dataSource: "This evaluation is based on Growth99's internal security framework, developed with guidance from security experts. It follows industry best practices for web protection and includes specific checks that matter most in real-world scenarios.",
          importance: "Security is critical to maintaining user trust, data integrity, and regulatory compliance. A secure site protects visitors from threats like data leaks, cross-site scripting (XSS), clickjacking, and other forms of exploitation.",
          whyHigh: "A high score means your website meets essential technical standards, such as SSL/TLS encryption, security headers, directory protection, and admin access restrictions—minimizing your exposure to common attack vectors.",
          reliable: "Unlike generic tools that only scan for surface-level issues, our system runs checks based on real-world vulnerabilities and attack patterns. These include:",
          reliableList: [
            "HTTP Security Headers (HSTS, X-Frame-Options, X-XSS-Protection)",
            "Proper SSL/TLS configuration",
            "Directory indexing and file access restrictions",
            "Admin access security"
          ],
          reliableConclusion: "This comprehensive, expert-defined checklist ensures you're not just secure on paper—but resilient against actual threats."
        };
      
      default:
        return null;
    }
  };

  const content = getTooltipContent(title);

  if (!content) return null;

  return (
    <div className="inline-block">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Info className="w-5 h-5 text-white fill-gray-400 hover:fill-[#799F92] transition-colors" strokeWidth={2} />
      </div>
      
      {isHovered && (
        <div className="absolute z-50 w-[350px] sm:w-lg p-4 bg-white border border-gray-200 rounded-lg shadow-2xl top-8 left-1/2 transform -translate-x-1/2">
         
          
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">What This Metric Represents?</h4>
              <p className="text-sm text-[#1F2F2F]">{content.represents}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Where Is This Data Coming From?</h4>
              <p className="text-sm text-[#1F2F2F]">{content.dataSource}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Why This Metric Is Important?</h4>
              <p className="text-sm text-[#1F2F2F]">{content.importance}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Why a High Score is Crucial?</h4>
              <p className="text-sm text-[#1F2F2F]">{content.whyHigh}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">What Makes Our Score More Reliable</h4>
              <p className="text-sm text-[#1F2F2F]">{content.reliable}</p>
              {content.reliableList && (
                <ul className="mt-2 space-y-1">
                  {content.reliableList.map((item, index) => (
                    <li key={index} className="text-sm text-[#1F2F2F] flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {content.reliableConclusion && (
                <p className="text-sm text-[#1F2F2F] mt-2">{content.reliableConclusion}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;

// <Info className="w-5 h-5 text-white fill-gray-400 hover:fill-[#799F92] transition-colors" strokeWidth={2} />