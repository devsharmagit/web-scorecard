import { Loader2,} from "lucide-react";
import type { PageSpeedData } from "../../types/pagespeed";
import { extractDesktopData } from "../../lib/helper";
import FailedDiagnostics from "../ui/FailedDiagnostics";
import PassedDiagnostics from "../ui/PassedDiagnostics";
import KeyMatrics from "../ui/KeyMatrics";
import desktopLayoutImage from '../../assets/desktop-layout.png';
import Grade from "../ui/Grade";

interface DesktopTabProps {
  data: PageSpeedData | null; // Allow data to be null initially
  loading?: boolean;
  isEliteClient: boolean; 
}

const DesktopTab = ({ data, loading, isEliteClient }: DesktopTabProps) => {


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-600">Analyzing desktop performance...</span>
      </div>
    );
  }

  if (!data?.lighthouseResult) {
    return (
      <div className="text-center text-gray-500 py-8">
        No performance data available
      </div>
    );
  }
  const performanceScore = data.lighthouseResult.categories?.performance?.score || 0;

  const filteredData = extractDesktopData(data);
  const speedIndex = filteredData?.performance?.analytics["speed-index"];
  const totalBlockingTime = filteredData?.performance?.analytics["total-blocking-time"];
  const passedDiagnostics = filteredData?.performance?.diagnostics?.passed || [];
  const failedDiagnostics = filteredData?.performance?.diagnostics?.failed || [];
  
  

  return (
    <div className="mx-auto bg-white">
      {/* Header with overall score */}
      <div className="flex lg:flex-row flex-col gap-5 lg:gap-0 items-center justify-between mb-8 lg:py-6">
        <Grade 
        description="Evaluates the speed and functionality of your website on desktop devices, ensuring optimal user experience for desktop users."
        isEliteClient={isEliteClient} score={performanceScore} title="Desktop Performance" showButton={true} />
          <div className="w-full flex-1 md:flex justify-center">
      <div className="hidden md:block">
        {/* Web performance layout container */}
        <div className="w-[420px] ml-auto text-center relative">
          {/* Screenshot image */}
          {data?.lighthouseResult?.audits['final-screenshot']['details']['data'] ? (
            <img 
              src={data?.lighthouseResult?.audits['final-screenshot']['details']['data']}
              alt="Website screenshot"
              className="w-[340px] mx-auto object-top h-[250px] object-cover relative z-0"
            />
          ) : (
            <div className="w-[350px] mx-auto h-[244px] bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
              <div className="text-xs text-gray-600 text-center px-2">
                Website Preview
              </div>
            </div>
          )}
          
          {/* Mobile frame overlay using pseudo-element alternative */}
          <div 
            className="absolute inset-0 w-full h-full bg-no-repeat bg-center z-10 pointer-events-none"
            style={{
              backgroundImage: `url(${desktopLayoutImage})`,
              backgroundSize: 'auto 257px',
            }}
          />
        </div>
      </div>
    </div>
      </div>

     <KeyMatrics speedIndex={speedIndex} totalBlockingTime={totalBlockingTime} />

      <div className="">       
       
     
    {/* Passed Diagnostics Section */}
      <PassedDiagnostics passedDiagnostics={passedDiagnostics} />


      {/* Failed Diagnostics Section */}
   <FailedDiagnostics failedDiagnostics={failedDiagnostics} />

    
    
     
    </div>
    </div>
  );
}

export default DesktopTab;