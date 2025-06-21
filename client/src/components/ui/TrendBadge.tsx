import React from 'react'
import uptrend from '../../assets/uptrend.png'
import downtrend from '../../assets/downtrend.png'
import flattrend from "../../assets/flat-trend.png"



const TrendBadge = ({trend, comparison} : {trend : number, comparison : string}) => {

   let badgeColor = '';
  let trendImage = '';
  
  if (trend > 0) {
    badgeColor = 'text-[#799F92] bg-[#D4E6E0]';
    trendImage = uptrend;
  } else if (trend < 0) {
    badgeColor = 'text-[#D92D20] bg-[#FEE4E2]';
    trendImage = downtrend;
  } else {
    badgeColor = 'text-[#522e23] bg-[#ffe4da]';
    trendImage = flattrend;
  }

  return (
    <div className="flex flex-col items-end gap-2 ml-4 max-w-[200px]">
          <span className={`flex items-center gap-1 px-2 py-1 rounded ${badgeColor} font-medium text-[12px]`}>
            {Math.abs(trend).toFixed(1)}%
            <img src={trendImage} alt="trend" className="w-4 h-4" />
          </span>
          <span className="text-[10px] lg:text-[12px]  text-[#1F2F2F] font-medium text-right leading-tight">
            {comparison}
          </span>
        </div>
  )
}

export default TrendBadge