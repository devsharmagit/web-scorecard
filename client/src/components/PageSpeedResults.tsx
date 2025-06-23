import { useState, useRef } from 'react';
import MobileTab from './tabs/MobileTab';
import DesktopTab from './tabs/DesktopTab';
import SEOTab from './tabs/SEOTab';
import TrafficTab from './tabs/TrafficTab';
import LeadTab from './tabs/LeadTab';
import SecurityTab from './tabs/SecurityTab';
import MainResult from './MainResult';
import { useAverageScore, useWebsiteData } from '../hooks/usePageSpeedHooks';
import BasicSEO from './BasicSEO';
import { ArrowDownToLine } from 'lucide-react';
import { getTabButtonClasses, TABS, type TabId } from '../constants/tab';
import { formatDate } from '../constants/date';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import Loader from './ui/Loader';

interface PageSpeedResultsProps {
    url: string;
}

const PageSpeedResults: React.FC<PageSpeedResultsProps> = ({ url }) => {
    const [activeTab, setActiveTab] = useState<TabId>('mobile');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    
    // Refs for PDF generation
    const mainResultRef = useRef<HTMLDivElement>(null);
    const mobileTabRef = useRef<HTMLDivElement>(null);
    const desktopTabRef = useRef<HTMLDivElement>(null);
    const seoTabRef = useRef<HTMLDivElement>(null);
    const trafficTabRef = useRef<HTMLDivElement>(null);
    const leadTabRef = useRef<HTMLDivElement>(null);
    const securityTabRef = useRef<HTMLDivElement>(null);

    
    // Custom hooks for data fetching
    const {mobileData, mobileLoading, mobileError, 
        desktopData, desktopLoading, desktopError,
        leadData, leadLoading,
        securityData, securityLoading, securityError,
        seoData, seoLoading, seoError,
        trafficData, trafficLoading, trafficError,
        isEliteClient, timeStamp, refetchData
    } = useWebsiteData(url)

    const avgScore = useAverageScore(mobileData, desktopData);
    const isMainResultLoading = mobileLoading || desktopLoading;

const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
        // Create a simple container for content
        const pdfContainer = document.createElement('div');
        pdfContainer.style.width = '800px';
        pdfContainer.style.backgroundColor = '#ffffff';
        pdfContainer.style.padding = '20px';
        pdfContainer.style.fontFamily = 'Arial, sans-serif';
        pdfContainer.style.position = 'absolute';
        pdfContainer.style.left = '-9999px';
        pdfContainer.style.top = '0';
        pdfContainer.style.lineHeight = '1.4';

        // Create header
        const header = document.createElement('div');
        header.style.marginBottom = '20px';
        header.style.borderBottom = '2px solid #e5e7eb';
        header.style.paddingBottom = '15px';
        header.innerHTML = `
            <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 10px 0; color: #111827;">Website Scorecard Report</h1>
            <p style="font-size: 16px; margin: 0; color: #6b7280;">URL: ${url}</p>
            ${timeStamp ? `<p style="font-size: 14px; margin: 5px 0 0 0; color: #6b7280;">Generated: ${formatDate(timeStamp)}</p>` : ''}
        `;
        pdfContainer.appendChild(header);

        // Helper function to add content sections
        const addSection = (title : string, contentRef :React.RefObject<HTMLDivElement | null> , shouldInclude = true) => {
            if (!shouldInclude || !contentRef?.current) return;
            
            // Add section title
            const sectionTitle = document.createElement('h2');
            sectionTitle.style.fontSize = '20px';
            sectionTitle.style.fontWeight = 'bold';
            sectionTitle.style.margin = '25px 0 15px 0';
            sectionTitle.style.color = '#374151';
            sectionTitle.style.borderBottom = '1px solid #d1d5db';
            sectionTitle.style.paddingBottom = '8px';
            sectionTitle.textContent = title;
            pdfContainer.appendChild(sectionTitle);
            
            // Clone and clean content
            const clonedContent = contentRef.current.cloneNode(true);
            
            // Clean up the cloned content for better PDF display
            const cleanElement = (element : any) => {
                // Remove problematic styles
                element.style.position = 'static';
                element.style.transform = 'none';
                element.style.overflow = 'visible';
                element.style.maxHeight = 'none';
                element.style.height = 'auto';
                
                // Improve text readability
                if (element.style.fontSize) {
                    const currentSize = parseInt(element.style.fontSize) || 14;
                    element.style.fontSize = Math.max(12, currentSize) + 'px';
                }
                
                // Handle images and canvases
                if (element.tagName === 'IMG' || element.tagName === 'CANVAS') {
                    element.style.maxWidth = '100%';
                    element.style.height = 'auto';
                    element.style.display = 'block';
                    element.style.margin = '10px 0';
                }
                
                // Handle SVG elements
                if (element.tagName === 'SVG') {
                    element.style.maxWidth = '100%';
                    element.style.height = 'auto';
                }
                
                // Clean child elements recursively
                Array.from(element.children).forEach(cleanElement);
            };
            
            cleanElement(clonedContent);
            
            // Add content with spacing
            const contentWrapper = document.createElement('div');
            contentWrapper.style.marginBottom = '20px';
            contentWrapper.appendChild(clonedContent);
            pdfContainer.appendChild(contentWrapper);
        };

        // Add all sections in order
        addSection('Overview', mainResultRef);
        addSection('Mobile Performance', mobileTabRef, (mobileData && !mobileLoading)? true : false);
        addSection('Desktop Performance', desktopTabRef, (desktopData && !desktopLoading)? true : false);
        addSection('SEO Analysis', seoTabRef, ((desktopData && !desktopLoading) || (seoData && !seoLoading))? true : false);
        addSection('Security Analysis', securityTabRef, (securityData && !securityLoading) ? true : false);
        addSection('Traffic Analysis', trafficTabRef, (trafficData && !trafficLoading) ? true : false);
        addSection('Lead Generation', leadTabRef, (leadData && !leadLoading)? true : false);

        // Add to DOM temporarily
        document.body.appendChild(pdfContainer);

        // Wait for content to render
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get container dimensions
        const containerHeight = pdfContainer.scrollHeight;
        const containerWidth = 800;

        // Generate canvas
        const canvas = await html2canvas(pdfContainer, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: containerWidth,
            height: containerHeight
        });

        // Remove from DOM
        document.body.removeChild(pdfContainer);

        // Create PDF with multiple pages if needed
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Calculate how much content fits per page
        const margin = 10;
        const availableWidth = pageWidth - (margin * 2);
        const availableHeight = pageHeight - (margin * 2);
        
        // Calculate the width to use (maintain aspect ratio)
        const imgWidth = availableWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // If content fits on one page
        if (imgHeight <= availableHeight) {
            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        } else {
            // Split content across multiple pages
            const pageRatio = availableHeight / imgHeight;
            const pageHeightInPixels = canvas.height * pageRatio;
            
            let yPosition = 0;
            let pageNumber = 0;
            
            while (yPosition < canvas.height) {
                if (pageNumber > 0) {
                    pdf.addPage();
                }
                
                // Create a temporary canvas for this page
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = canvas.width;
                pageCanvas.height = Math.min(pageHeightInPixels, canvas.height - yPosition);
                
                const pageCtx = pageCanvas.getContext('2d');
                pageCtx?.drawImage(
                    canvas,
                    0, yPosition, canvas.width, pageCanvas.height,
                    0, 0, canvas.width, pageCanvas.height
                );
                
                const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
                const pageImgHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;
                
                pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, pageImgHeight);
                
                yPosition += pageHeightInPixels;
                pageNumber++;
            }
        }

        // Save the PDF
        const fileName = `website-scorecard-${url.replace(/[^a-zA-Z0-9]/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        setIsGeneratingPDF(false);
    }
};

    const isDataLoading = mobileLoading || desktopLoading || seoLoading || securityLoading || trafficLoading || leadLoading;

    if(isMainResultLoading){
        return <Loader text='Loading data...'  />
    }

    return (
        <div className="">
            {/* Header Section */}
            <div className="text-left mb-0 lg:mb-8 flex flex-col items-center lg:flex-row justify-between">
                <div className='flex flex-col mb-4 gap-2 text-center lg:text-left'>
                    <h2 className="text-2xl font-medium text-gray-900">
                        Website Scorecard
                    </h2>
                    {timeStamp && (
                        <p className='text-sm text-gray-900'>
                            Last Update at: {formatDate(timeStamp)}
                            <span 
                                onClick={()=>refetchData()} 
                                className='text-blue-500 underline hover:cursor-pointer'
                            >
                                {' '}(Refresh Data)
                            </span>
                        </p>
                    )}
                </div>
                <button 
                    onClick={generatePDF}
                    disabled={isDataLoading || isGeneratingPDF}
                    className="disabled:bg-[#1F2F2F]/20 flex gap-2 items-center bg-[#1F2F2F] hover:bg-[#799f92] shadow-none hover:shadow-2xl text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 text-xs hover:cursor-pointer disabled:cursor-not-allowed"
                >
                    <ArrowDownToLine height={20} width={20} /> 
                    {isGeneratingPDF ? 'GENERATING PDF...' : 'DOWNLOAD PDF'}
                </button>
            </div>

            {/* Main Result Component */}
            <div ref={mainResultRef}>
                <MainResult
                    url={url}
                    loading={isMainResultLoading}
                    averageScore={avgScore}
                />
            </div>

            {/* Tab Navigation */}
            <div className="px-0 lg:px-10">
                <div className="flex bg-white text-center sm:overflow-hidden overflow-x-scroll w-full">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={getTabButtonClasses(tab.id, activeTab, leadData, trafficData)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-0 py-6 lg:px-10">
                {/* Mobile Tab */}
                <div className={activeTab === 'mobile' ? 'block' : 'hidden'}>
                    <div ref={mobileTabRef}>
                        <MobileTab
                            data={mobileData}
                            loading={mobileLoading}
                            isEliteClient={isEliteClient}
                            isError={mobileError}
                        />
                    </div>
                </div>

                {/* Desktop Tab */}
                <div className={activeTab === 'desktop' ? 'block' : 'hidden'}>
                    <div ref={desktopTabRef}>
                        <DesktopTab
                            data={desktopData}
                            loading={desktopLoading}
                            isEliteClient={isEliteClient}
                            isError={desktopError}
                        />
                    </div>
                </div>

                {/* SEO Tab */}
                <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
                    <div ref={seoTabRef}>
                        <SEOTab data={desktopData} loading={desktopLoading} isError={desktopError} />
                        <BasicSEO data={seoData} isError={seoError} loading={seoLoading} />
                    </div>
                </div>

                {/* Traffic Tab - Conditionally rendered */}
                {trafficData && (
                    <div className={activeTab === 'traffic' ? 'block' : 'hidden'}>
                        <div ref={trafficTabRef}>
                            <TrafficTab trafficData={trafficData} loading={trafficLoading} isError={trafficError} />
                        </div>
                    </div>
                )}

                {/* Lead Tab - Conditionally rendered */}
                {leadData && (
                    <div className={activeTab === 'lead' ? 'block' : 'hidden'}>
                        <div ref={leadTabRef}>
                            <LeadTab leadData={leadData} loading={leadLoading} />
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                <div className={activeTab === 'security' ? 'block' : 'hidden'}>
                    <div ref={securityTabRef}>
                        <SecurityTab data={securityData} loading={securityLoading} error={securityError} />
                    </div>
                </div>
            </div>

            {/* Hidden elements for PDF generation - render all tabs invisibly */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden' }}>
                {/* Mobile content for PDF */}
                <div ref={mobileTabRef} style={{ width: '800px', backgroundColor: 'white', padding: '20px' }}>
                    <MobileTab
                        data={mobileData}
                        loading={false}
                        isEliteClient={isEliteClient}
                        isError={mobileError}
                    />
                </div>

                {/* Desktop content for PDF */}
                <div ref={desktopTabRef} style={{ width: '800px', backgroundColor: 'white', padding: '20px' }}>
                    <DesktopTab
                        data={desktopData}
                        loading={false}
                        isEliteClient={isEliteClient}
                        isError={desktopError}
                    />
                </div>

                {/* SEO content for PDF */}
                <div ref={seoTabRef} style={{ width: '800px', backgroundColor: 'white', padding: '20px' }}>
                    <SEOTab data={desktopData} loading={false} isError={desktopError} />
                    <BasicSEO data={seoData} isError={seoError} loading={false} />
                </div>

                {/* Traffic content for PDF */}
                {trafficData && (
                    <div ref={trafficTabRef} style={{ width: '800px', backgroundColor: 'white', padding: '20px' }}>
                        <TrafficTab trafficData={trafficData} loading={false} isError={trafficError} />
                    </div>
                )}

                {/* Lead content for PDF */}
                {leadData && (
                    <div ref={leadTabRef} style={{ width: '800px', backgroundColor: 'white', padding: '20px' }}>
                        <LeadTab leadData={leadData} loading={false} />
                    </div>
                )}

                {/* Security content for PDF */}
                <div ref={securityTabRef} style={{ width: '800px', backgroundColor: 'white', padding: '20px' }}>
                    <SecurityTab data={securityData} loading={false} error={securityError} />
                </div>
            </div>
        </div>
    );
};

export default PageSpeedResults;