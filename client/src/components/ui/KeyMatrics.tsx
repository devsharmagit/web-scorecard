import React from 'react'
import type { AnalyticsMetric } from '../../lib/helper'
import { ScoreIcon } from './ScoreIcons'
import { getScoreColor } from '../../constants/grading'

interface KeyMatricsProps {
  speedIndex?: AnalyticsMetric;
  totalBlockingTime?: AnalyticsMetric;
}

const KeyMatrics = ({speedIndex, totalBlockingTime}: KeyMatricsProps) => {
  return (
      
          <div className="grid border border-gray-200 rounded p-2.5  grid-cols-2 md:grid-cols-2 gap-6 mb-8">
            {/* Speed Index */}
            {speedIndex && (
              <div className="">
              <div className="flex gap-2">
                <div className="pt-4">
                  <ScoreIcon score={speedIndex.score} />
                </div>
              <div>
                  <h3 className="text-xs lg:text-base text-[#333]">Speed Index</h3>
                  <div className={`text-base lg:text-2xl   ${getScoreColor(speedIndex.score)}`}>
                    {speedIndex.displayValue}
                  </div>
              </div>
            </div>
          </div>
            )}
    
            {/* Total Blocking Time */}
             {totalBlockingTime && (
              <div className="">
              <div className="flex gap-2">
                <div className="pt-4">
                  <ScoreIcon score={totalBlockingTime.score} />
                </div>
              <div>
                  <h3 className="text-xs lg:text-base text-[#333]">Total Blocking Time</h3>
                  <div className={`text-base lg:text-2xl   ${getScoreColor(totalBlockingTime.score)}`}>
                    {totalBlockingTime.displayValue}
                  </div>
              </div>
            </div>
          </div>
            )}
          </div>
  )
}

export default KeyMatrics