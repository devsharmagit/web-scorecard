import {
    getGrade,
    getRatingStatus,
} from '../constants/grading';
import Loader from './ui/Loader';

const MainResult = ({
    loading,
    averageScore,
    url,
}: {
    loading: boolean;
    averageScore: number;
    url: string;
}) => {
    if (loading) {
        return (
            <Loader />
        );
    }

    const grade = getGrade(averageScore);
    const ratingStatus = getRatingStatus(averageScore);
    
    return (
        <div className="px-10">
            {/* Header with URL and Grade */}
            <div className="flex flex-col lg:flex-row text-center lg:text-left items-center gap-2 lg:gap-10 mb-4">
                
                    <div className={` text-4xl lg:text-[52px] font-medium text-black w-[240px] h-[70px] lg:h-[120px] flex justify-center items-center` }>
                        {grade}
                    </div>
                    <div className="flex flex-col gap-2 text-center lg:text-left">
                        <div className="text-base font-semibold text-gray-900">{url}</div>

                        <div className="text-2xl font-medium ">
                            This site  {(ratingStatus === "Excellent" || ratingStatus === "Good") && "is" }
                            <span className="font-bold text-[#799F92]">
                              {" "}  {ratingStatus}.
                            </span>
                        </div>
                        <div className="text-base font-semibold leading-[1.2]">
                            Your website is performing well, but there are some
                            minor areas for improvement. High scores mean better
                            visibility, user experience, and conversions. Below,
                            we break down your scores and what actions, if any,
                            are needed.
                        </div>
                    </div>
                
            </div>

            {/* Description */}
        </div>
    );
};

export default MainResult;
