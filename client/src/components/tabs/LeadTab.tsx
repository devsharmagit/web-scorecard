import React from 'react'
import TrendBadge from '../ui/TrendBadge';
import type { LeadDataType } from '../../types/lead.type';

const LeadTab = ({leadData} : {loading : boolean, leadData : LeadDataType[]}) => {
  return (
    <div className='mx-auto bg-white'>
      <div className="flex items-center justify-between mb-8 py-5 lg:py-10">
              <div className="flex-1">
                <div className="flex flex-col justify-center items-center gap-2">
                  
                  <h1 className="text-lg font-semibold text-gray-900">Leads</h1>
                  <p className="text-[#1F2F2F] text-sm max-w-xl text-center">
                   Monitors the number of potential customers engaging with your site, indicating its effectiveness in capturing business opportunities.
                  </p>
                </div>
              </div>
            
            </div>

             <div className="space-y-4 mb-8">
         <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Leads Information
          </h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-600 text-sm'>
          {leadData.map((leadItem: LeadDataType, index: number) => {
                        
            return (
              <div key={index} className="bg-white border border-[#799F92] rounded-md px-[15px] py-2.5 lg:p-6  flex flex-col justify-between">
                <div className="flex items-center justify-between h-full ">
                  {/* Value and Label */}
                  <div className="flex flex-col items-start gap-1">
                    <h3 className="font-medium text-[26px] lg:text-[32px] text-gray-900 leading-none">{leadItem.value}</h3>
                    <p className='font-semibold lg:text-sm text-xs text-gray-900'>{leadItem.label}</p>
                  </div>
                  {/* Trend Badge */}
                  <TrendBadge comparison={leadItem.comparison} trend={leadItem.trend} />
                </div>
              </div>
            );
          })}
          </div>
        </div>
    </div>
  )
}

export default LeadTab