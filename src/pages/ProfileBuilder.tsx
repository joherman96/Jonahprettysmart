import React, { useState } from 'react';
import BasicDetailsCard from '../components/profile/BasicDetailsCard';

interface BasicDetailsData {
  preferredName: string;
  pronouns: string;
  year: string;
  major: string;
  minor: string;
  photoUrl: string;
}

const ProfileBuilder: React.FC = () => {
  const [basicDetails, setBasicDetails] = useState<BasicDetailsData>({
    preferredName: "",
    pronouns: "",
    year: "",
    major: "",
    minor: "",
    photoUrl: ""
  });
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Build Your Profile</h1>
        
        {currentStep === 1 && (
          <>
            <BasicDetailsCard
              data={basicDetails}
              onChange={updated => setBasicDetails(prev => ({ ...prev, ...updated }))}
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={
                  !basicDetails.preferredName ||
                  !basicDetails.pronouns ||
                  !basicDetails.year ||
                  !basicDetails.major
                }
                className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </>
        )}

        {currentStep !== 1 && (
          <div className="text-center text-gray-500">
            Next steps coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBuilder;