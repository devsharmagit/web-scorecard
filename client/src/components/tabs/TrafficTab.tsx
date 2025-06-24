import type { TrafficDataType } from '../../types/traffic.type';
import ImproveWebsiteButton from '../ui/ImproveWebsiteButton';
import TrendBadge from '../ui/TrendBadge';


interface TrafficTabProps {
  trafficData: TrafficDataType ,
  loading: boolean,
  isError: boolean,
  isEliteClient: boolean;
}

function TrafficTab({ trafficData, isError, isEliteClient }: TrafficTabProps) {
  
  if(isError){
    return (
      <div className="text-center text-red-500 py-8">
        Error fetching Traffic data.
      </div>
    );
  }
  
  if (!trafficData) {
    return <div className="mx-auto bg-white">No Traffic Data Available...</div>;
  }

  const { previousMonthTraffic, traffic } = trafficData;
  
  // Calculate trend percentage
  const calculateTrend = () => {
    if (!Number(previousMonthTraffic) || Number(previousMonthTraffic) === 0) {
      return 0;
    }
    return ((Number(traffic) - Number( previousMonthTraffic)) / Number(previousMonthTraffic)) * 100;
  };

  // Generate dynamic comparison date range
  const generateComparisonDates = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based (0 = January, 5 = June)
    
    // Calculate the previous two months
    const endMonth = currentMonth - 1; // Last month
    const startMonth = currentMonth - 2; // Two months ago
    
    // Handle year rollover
    let startYear = currentYear;
    let endYear = currentYear;
    
    let adjustedStartMonth = startMonth;
    let adjustedEndMonth = endMonth;
    
    if (startMonth < 0) {
      adjustedStartMonth = 12 + startMonth; // Convert negative to previous year months
      startYear = currentYear - 1;
    }
    
    if (endMonth < 0) {
      adjustedEndMonth = 12 + endMonth;
      endYear = currentYear - 1;
    }
    
    // Month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get last day of end month
    const lastDayOfEndMonth = new Date(endYear, adjustedEndMonth + 1, 0).getDate();
    
    const startMonthName = monthNames[adjustedStartMonth];
    const endMonthName = monthNames[adjustedEndMonth];
    
    return `${startMonthName} 1, ${startYear} to ${endMonthName} ${lastDayOfEndMonth}, ${endYear}`;
  };

  const trend = calculateTrend();
  
  // Create leadItem object with calculated trend and dynamic comparison
  const leadItem = {
    trend: trend,
    comparison: generateComparisonDates()
  };



  return (
    <div className="bg-white mx-auto ">
      <div className="flex items-center justify-between mb-8 py-5 lg:py-10">
        <div className="flex-1">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">Traffic</h1>
            <p className="text-[#1F2F2F] text-sm max-w-xl text-center">
              Reflects the volume of visitors to your website, providing insight into its online reach and audience engagement.
            </p>
            {!isEliteClient && <ImproveWebsiteButton />}
          </div>
        </div>
      </div>
      <h1 className="text-xl font-semibold text-gray-900 text-center mb-3">
        Traffic Information
        </h1>
      <div className="flex items-center max-w-[350px] mx-auto justify-between h-full p-4 border border-[#799F92] rounded-lg">
        {/* Value and Label */}
        <div className="flex flex-col items-start gap-1">
          <h3 className="font-medium text-2xl text-gray-800 leading-none">
            {trafficData.traffic.toLocaleString()}
          </h3>
          <p className="text-base text-gray-900">
            Total traffic
          </p>
        </div>
        
        {/* Trend Badge */}
        <TrendBadge comparison={leadItem.comparison} trend={leadItem.trend} />
      </div>
    </div>
  );
}

export default TrafficTab;