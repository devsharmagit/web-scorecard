import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const LeadTab = ({leadData} : {loading : boolean, leadData : null | any}) => {
  return (
    <div className='mx-auto bg-white'>
      <div className="flex items-center justify-between mb-8 py-10">
              <div className="flex-1">
                <div className="flex flex-col justify-center items-center gap-2">
                  
                  <h1 className="text-xl font-bold text-gray-900"> Leads </h1>
                  <p className="text-gray-600 text-sm max-w-xl text-center">
                   Monitors the number of potential customers engaging with your site, indicating its effectiveness in capturing business opportunities.
                  </p>
                </div>
              </div>
            
            </div>

             <div className="space-y-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Leads Information
          </h2>
          <div className='flex items-center flex-wrap justify-center gap-4 text-gray-600 text-sm'>
          {leadData.map((leadItem: any, index: number) => {
            // Determine badge color and icon
            let badgeColor = '';
            let Icon = Minus;
            if (leadItem.trend > 0) {
              badgeColor = 'bg-green-100 text-green-700';
              Icon = ArrowUpRight;
            } else if (leadItem.trend < 0) {
              badgeColor = 'bg-red-100 text-red-700';
              Icon = ArrowDownRight;
            } else {
              badgeColor = 'bg-orange-100 text-orange-700';
              Icon = Minus;
            }
            return (
              <div key={index} className="bg-white border border-[#799F92] rounded-md p-6 min-w-[220px] max-w-[350px] flex flex-col justify-between">
                <div className="flex items-center justify-between h-full ">
                  {/* Value and Label */}
                  <div className="flex flex-col items-start gap-1">
                    <h3 className="font-semibold text-4xl text-gray-900 leading-none">{leadItem.value}</h3>
                    <p className='font-semibold text-sm text-gray-900'>{leadItem.label}</p>
                  </div>
                  {/* Trend Badge */}
                  <div className="flex flex-col items-end gap-1 ml-4">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColor} font-semibold text-sm`}>
                      {leadItem.trend !== 0 && <Icon className="w-4 h-4" />}
                      {leadItem.trend.toFixed(2)}%
                    </span>
                    <span className="text-xs text-gray-500 text-right max-w-[110px] leading-tight">{leadItem.comparison}</span>
                  </div>
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