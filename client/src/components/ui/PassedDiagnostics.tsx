import React from 'react'
import type { DiagnosticEntry } from '../../lib/helper'

const PassedDiagnostics = ({passedDiagnostics} : {passedDiagnostics : DiagnosticEntry[]}) => {
  return (
    <>
     {passedDiagnostics.length > 0 && (
        <div className="mb-8 border-[#799F92] border rounded-lg overflow-hidden ">
          {passedDiagnostics.map((diagnostic, index) => (
             <div key={index} className={"bg-white p-4 " + (index !== 0 && "border-gray-200 border-t")}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex justify-between md:justify-start items-center gap-3 mb-2.5">
                    <h3 className="font-semibold text-[15px] md:text-lg text-gray-900">{diagnostic.title}</h3>
                    <span className="px-2 py-1 rounded md:rounded-lg text-xs md:text-base bg-[#799F92] text-white">
                      Excellent
                    </span>
                  </div>
                  <p className="text-sm text-[#1F2F2F] ">
                    {diagnostic.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default PassedDiagnostics