import {
    getGrade,
    getRatingStatus,
} from '../constants/grading';
import { Loader2 } from 'lucide-react';

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
            <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin" /> Loading...
            </div>
        );
    }

    const grade = getGrade(averageScore);
    const ratingStatus = getRatingStatus(averageScore);
    
    return (
        <div className="px-10">
            {/* Header with URL and Grade */}
            <div className="flex items-center gap-10 mb-4">
                
                    <div className={`text-6xl font-bold text-black w-[120px] h-[120px] flex justify-center items-center` }>
                        {grade}
                    </div>
                    <div className="flex flex-col gap-3 text-left">
                        <div className="text-base font-semibold ">{url}</div>

                        <div className="text-xl font-semibold ">
                            This site is{' '}
                            <span className="font-bold text-[#799F92]">
                                {ratingStatus}
                            </span>
                        </div>
                        <div className="text-base font-semibold leading-relaxed">
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
