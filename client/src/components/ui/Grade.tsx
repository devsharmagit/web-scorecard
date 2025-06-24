import { getGrade } from '../../constants/grading';
import ImproveWebsiteButton from './ImproveWebsiteButton';
import InfoTooltip from './InfoTolltip';

interface GradeProps {
  score: number;
  title: string;
  description: string;
  isEliteClient: boolean;
  showButton?: boolean;
}

const Grade = ({score, title, description, isEliteClient, showButton} : GradeProps) => {
    const getPerformanceGrade = (score: number) => {
     return getGrade(score)
    };
      const formatScore = (score: number) => {
    return Math.round(score * 100);
  };
  return (
    <div className="flex-1">
          <div className=" flex flex-col justify-center items-center gap-2">
            <div className={` text-4xl lg:text-[52px] font-medium text-gray-900`}>
              {getPerformanceGrade(formatScore(score))}
            </div>
               <div className="relative flex items-center gap-2">
                <h1 className=" text-lg font-semibold text-gray-900">
                  {title}
                </h1>
                <InfoTooltip title={title} />
              </div>
              <p className="text-[#1F2F2F] text-sm max-w-xl text-center" >
                {description}
              </p>
              {showButton && !isEliteClient && <ImproveWebsiteButton />}
            
          </div>
        </div>
  )
}

export default Grade