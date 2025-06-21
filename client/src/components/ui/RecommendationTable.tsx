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
const renderCellContent = (item: DiagnosticItem, heading: DiagnosticHeading) => {
  const value = item[heading.key] ?? item[heading.valueType] ?? '-';

  // If it's a valid URL
  if (typeof value === 'string' && isValidUrl(value)) {
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

  // If it's a string or number, render as is
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  // If it's an object (like the "node"), try rendering a meaningful part of it
  if (typeof value === 'object' && value !== null) {
    // Prefer `snippet`, fallback to `nodeLabel`, else JSON string
    if (value.snippet) {
      return <code className="text-xs">{value.snippet}</code>;
    } else if (value.nodeLabel) {
      return <span className="text-xs">{value.nodeLabel}</span>;
    } else {
      return <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(value, null, 2)}</pre>;
    }
  }

  return '-';
};


  // Don't render if no data
  if (!diagnostic?.recommended_details?.items || !diagnostic?.recommended_details?.headings) {
    return null;
  }

  return (
    <div className="mt-4 w-full">
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
        <div className="mt-4 w-full overflow-x-scroll">
          
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
      )}
    </div>
  );
};
export default RecommendationTable;