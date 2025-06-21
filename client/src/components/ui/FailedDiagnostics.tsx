import React from 'react'
import type { DiagnosticEntry } from '../../lib/helper'
import RecommendationTable from './RecommendationTable'

const FailedDiagnostics = ({failedDiagnostics}: {failedDiagnostics : DiagnosticEntry[]}) => {
  return (
    <>
       {failedDiagnostics.length > 0 && (
        <div className="mb-8 border-[#fa3] border rounded-lg w-full overflow-hidden">
          {failedDiagnostics.map((diagnostic, index) => (
            <div key={index} className={"bg-white p-4 w-full " + (index !== 0 && "border-gray-200 border-t")}>
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 w-full">
                  <div className="flex justify-between md:justify-start items-center gap-3 mb-2.5">
                    <h3 className="font-semibold text-[15px] md:text-lg text-gray-900">{diagnostic.title}</h3>
                    <span className="px-2 py-1 rounded md:rounded-lg text-xs md:text-base bg-[#fa3] text-white">
                      Needs Improvement
                    </span>
                  </div>
                  <p className="text-sm text-[#1F2F2F]">
                    {diagnostic.description}
                  </p>
                  
                  {/* Table for failed diagnostics with details */}
                   {diagnostic.recommended_details && diagnostic.recommended_details.items && (
                    <RecommendationTable diagnostic={diagnostic} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}    
    </>
  )
}

export default FailedDiagnostics