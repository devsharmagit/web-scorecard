import { getGrade, getGradeColor, getRatingStatus, getStatusColor } from '../constants/grading';
import { Loader2 } from 'lucide-react';

const MainResult = ({ loading, averageScore, url }: { loading: boolean; averageScore: number, url:string }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className='animate-spin' /> Loading...
      </div>
    );
  }



  const grade = getGrade(averageScore);
  const gradeColorClass = getGradeColor(grade);

  const ratingStatus = getRatingStatus(averageScore);
  const statusColorClass = getStatusColor(ratingStatus);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mx-auto">
      {/* Header with URL and Grade */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">
            {url}
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-6xl font-bold ${gradeColorClass}`}>
              {grade}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">
                This site is <span className={statusColorClass}>{ratingStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-gray-700 text-sm leading-relaxed">
        Your website is performing well, but there are some minor areas for improvement. 
        High scores mean better visibility, user experience, and conversions. Below, we 
        break down your scores and what actions, if any, are needed.
      </div>
    </div>
  );
};

export default MainResult;