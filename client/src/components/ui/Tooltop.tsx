import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  tooltipKey: string;
  className?: string;
}

const tooltipContent = {
  common_keywords: "A list of keywords that appear frequently in the text of your content.",
  SEO_description: "SEO analysis of your page's meta-description.",
  H1_contents: "SEO Analysis of the H1 Tags on your page.",
  H2_contents: "SEO analysis of the H2 headings on your page.",
  Image_ALT_Attributes: "SEO analysis of the \"alt\" attribute for image tags.",
  Keywords_in_Title_and_Description: "SEO analysis of the HTML page's Title and meta description content.",
  Links_Ratio: "SEO analysis of the ratio of internal links to external links.",
  SEO_Title: "SEO analysis of your site's HTML title.",
    search_preview: "Here is how your site may appear in search results:",
  mobile_search_preview: "Here is how your site may appear in search results:",
  canonical_contents: "Does your content have a \"canonical\" URL?",
  noindex_description: "Does your content contain a noindex robots meta tag?",
  checkcanonicalization: "Does your site appear on more than one URL?",
  og_contents: "Does your site use OpenGraph meta tags?",
  robot_text_analytics: "Does your site have a valid robots.txt file",
};

export const Tooltip: React.FC<TooltipProps> = ({ tooltipKey, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <HelpCircle 
        size={16} 
        className="text-white fill-[#95a6ae] cursor-pointer transition-colors duration-300 ease-in-out hover:fill-blue-500"
        style={{ fill: '#95a6ae' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.fill = '#3b82f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.fill = '#95a6ae';
        }}
      />
      
      <div 
        className={`absolute bottom-full left-1/2 pointer-events-none transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          fontSize: '11px',
          fontWeight: 400,
          lineHeight: 1.5,
          width: '200px',
          padding: '8px 10px',
          transform: 'translate3d(-50%, 0, 0)',
          textAlign: 'center',
          color: '#fff',
          borderRadius: '3px',
          background: '#555d66',
        }}
      >
        {tooltipContent[tooltipKey] && tooltipContent[tooltipKey]}
        
        {/* Triangle pointer */}
        <div
          className="absolute"
          style={{
            content: '',
            transform: 'translate3d(-50%, 0, 0)',
            position: 'absolute',
            top: '100%',
            left: '50%',
            borderStyle: 'solid',
            height: 0,
            width: 0,
            borderColor: '#555d66 transparent transparent',
            borderWidth: '8px 7px 0',
          }}
        />
      </div>
    </div>
  );
};
