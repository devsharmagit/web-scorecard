import React from 'react';
import Grade from '../ui/Grade';
import type { SecurityCheck, SecurityDataType } from '../../types/security';
import Loader from '../ui/Loader';

interface SecurityTabProps {
  data: SecurityDataType | null
  error: boolean,
  loading: boolean
}

const SecurityTab: React.FC<SecurityTabProps> = ({ data, error, loading } : SecurityTabProps) => {

  const score = data?.data_desktop_security?.score || 0;
  const passed = data?.data_desktop_security?.passed || [];
  const failed = data?.data_desktop_security?.failed || [];

  // Group diagnostics by group property
  const groupDiagnostics = (diagnostics: SecurityCheck[]): Record<string, SecurityCheck[]> => {
    return diagnostics.reduce((groups: Record<string, SecurityCheck[]>, diagnostic) => {
      const group = diagnostic.group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(diagnostic);
      return groups;
    }, {});
  };

  const passedGroups = groupDiagnostics(passed);
  const failedGroups = groupDiagnostics(failed);

  if (loading) {
    return (
      <Loader text='Loading Security data ...' />
    );
  }

  if(error){
    return (
      <div className="text-center text-red-500 py-8">
        Error fetching Security data.
      </div>
    );
  }

  const renderDiagnosticGroup = (
    groupName: string,
    diagnostics: SecurityCheck[],
    isPassed: boolean
  ) => {
    return (
      <div key={groupName} className="mb-8">
        <h3 className="text-[20px] md:text-2xl font-bold text-gray-900 py-3 text-center">
          {groupName}
        </h3>
        <div className={`border rounded-lg overflow-hidden ${isPassed ? 'border-[#799F92]' : 'border-[#fa3]'}`}>
          {diagnostics.map((diagnostic, index) => (
            <div key={index} className={`bg-white p-4 ${index !== 0 ? 'border-gray-200 border-t' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex justify-between md:justify-start items-center gap-3 mb-2.5">
                    <h4 className="font-semibold text-[15px] md:text-lg text-gray-900">{diagnostic.title}</h4>
                    <span className={`px-2 py-1 rounded md:rounded-lg text-xs md:text-base  text-white ${
                      isPassed 
                        ? 'bg-[#799F92]' 
                        : 'bg-[#fa3]'
                    }`}>
                      {isPassed ? 'Excellent' : 'Needs Improvement'}
                    </span>
                  </div>
                  {isPassed && (
                    <p className="text-sm text-[#1F2F2F]">
                      {diagnostic.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mb-8 py-5 lg:py-10">
        <Grade 
          description='Reviews the implementation of best practices to safeguard user data and ensure the website is protected against potential threats.' 
          title='Security'
          score={score}
          isEliteClient={false}
          showButton={false}
        />
      </div>

      {Object.keys(passedGroups).length > 0 && (
        <div className="mb-8">
          {Object.entries(passedGroups).map(([groupName, diagnostics]) =>
            renderDiagnosticGroup(groupName, diagnostics, true)
          )}
        </div>
      )}

      {Object.keys(failedGroups).length > 0 && (
        <div className="mb-8">
          {Object.entries(failedGroups).map(([groupName, diagnostics]) =>
            renderDiagnosticGroup(groupName, diagnostics, false)
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityTab;
