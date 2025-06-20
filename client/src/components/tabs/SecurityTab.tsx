import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getGrade } from '../../constants/grading';

const SecurityTab = ({url}: {url:string}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log('SecurityTab rendered with URL:', data);

  useEffect(() => {
    const fetchSecurityData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post('http://localhost:3000/security', { url });
        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'An error occurred while fetching security data.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (url) {
      fetchSecurityData();
    }
  }, [url]);

  const score = data?.data_desktop_security?.score || 0;
  const passed = data?.data_desktop_security?.passed || [];
  const failed = data?.data_desktop_security?.failed || [];

  // Group diagnostics by group property
  const groupDiagnostics = (diagnostics: any[]) => {
    return diagnostics.reduce((groups: any, diagnostic: any) => {
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
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Analyzing website security...</p>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p>{error}</p>
      </div>
    );
  }

  const renderDiagnosticGroup = (groupName: string, diagnostics: any[], isPassed: boolean) => {
    return (
      <div key={groupName} className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center pb-2">
          {groupName}
        </h3>
        <div className="space-y-4">
          {diagnostics.map((diagnostic, index) => (
            <div key={index} className={`bg-white border ${isPassed ? 'border-[#799F92]' : 'border-[#fa3]'} rounded-sm p-4`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-xl text-gray-900">{diagnostic.title}</h4>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      isPassed 
                        ? 'bg-[#799F92] text-white' 
                        : diagnostic.status === 'Needs Attention' 
                          ? 'bg-[#fa3] text-white'
                          : 'bg-red-500 text-white'
                    }`}>
                      {diagnostic.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {diagnostic.description}
                  </p>
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
      <div className="flex items-center justify-between mb-8 py-10">
        <div className="flex-1">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className={`text-6xl font-semibold text-gray-900`}>
              {getGrade(Math.round(score))}
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Security
            </h1>
            <p className="text-gray-600 text-sm max-w-xl text-center">
              Reviews the implementation of best practices to safeguard user data and ensure the website is protected against potential threats.
            </p>
          </div>
        </div>
      </div>

      {Object.keys(passedGroups).length > 0 && (
        <div className="mb-8">
          {Object.entries(passedGroups).map(([groupName, diagnostics]) =>
            renderDiagnosticGroup(groupName, diagnostics as any[], true)
          )}
        </div>
      )}

      {Object.keys(failedGroups).length > 0 && (
        <div className="mb-8">
          {Object.entries(failedGroups).map(([groupName, diagnostics]) =>
            renderDiagnosticGroup(groupName, diagnostics as any[], false)
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityTab;