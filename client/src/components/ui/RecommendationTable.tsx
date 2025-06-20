import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DiagnosticEntry ,DiagnosticItem, DiagnosticHeading } from '../../lib/helper';

const RecommendationTable = ({ diagnostic }:{diagnostic : DiagnosticEntry}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to check if a value is a valid URL
  const isValidUrl = (value : string) => {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  // Helper function to render cell content
  const renderCellContent = (item : DiagnosticItem, heading : DiagnosticHeading) => {
    let value;
    
    if (typeof item === 'object' && item !== null) {
      value = item[heading.key] || item[heading.valueType] || '-';
    } else if (Array.isArray(item)) {
      value = item[heading.key] || '-';
    } else {
      value = item;
    }

    // If the value is a valid URL, render as a link
    if (isValidUrl(value)) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value}
        </a>
      );
    }

    return value;
  };

  // Don't render if no data
  if (!diagnostic?.recommended_details?.items || !diagnostic?.recommended_details?.headings) {
    return null;
  }

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="border border-gray-200 rounded-4xl flex items-center gap-2 px-4 py-2 bg-white  text-[#1F2F2F] text-xs font-semibold "
      >
        VIEW RECOMMENDATION
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Collapsible Table */}
      {isExpanded && (
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-50 border border-gray-200 rounded">
              <thead className="bg-gray-100">
                <tr>
                  {diagnostic.recommended_details.headings.map((heading, headingIndex) => (
                    heading.label && (
                      <th 
                        key={headingIndex} 
                      >
                        {heading.label || heading.key || heading.valueType}
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {diagnostic.recommended_details.items.slice(0, 5).map((item, itemIndex) => (
                  <tr key={itemIndex} className="hover:bg-gray-50">
                    {diagnostic.recommended_details.headings && diagnostic.recommended_details.headings.map((heading, headingIndex) => (
                      heading.label && (
                        <td 
                          key={headingIndex} 
                        >
                          {renderCellContent(item, heading)}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default RecommendationTable;