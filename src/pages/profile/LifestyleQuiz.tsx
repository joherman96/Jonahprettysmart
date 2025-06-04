import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { saveLifestyleQuiz } from '../../services/profile.service';

const LifestyleQuiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  // Redirect if no userId
  React.useEffect(() => {
    if (!userId) {
      navigate('/welcome');
    }
  }, [userId, navigate]);

  const [bedtime, setBedtime] = useState<number | null>(null);
  const [wakeTime, setWakeTime] = useState<number | null>(null);
  const [cleanliness, setCleanliness] = useState<number | null>(null);
  const [noiseTolerance, setNoiseTolerance] = useState<number | null>(null);
  const [guestFrequency, setGuestFrequency] = useState<number | null>(null);
  const [petFriendliness, setPetFriendliness] = useState<number | null>(null);
  const [smokingPreference, setSmokingPreference] = useState<number | null>(null);
  const [travelFrequency, setTravelFrequency] = useState<number | null>(null);
  const [studyLocation, setStudyLocation] = useState<number | null>(null);

  const allAnswered = [
    bedtime, wakeTime, cleanliness, noiseTolerance,
    guestFrequency, petFriendliness, smokingPreference,
    travelFrequency, studyLocation
  ].every(val => val !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered || !userId) return;

    try {
      const lifestyleData = {
        bedtime: bedtime!,
        wakeTime: wakeTime!,
        cleanliness: cleanliness!,
        noiseTolerance: noiseTolerance!,
        guestFrequency: guestFrequency!,
        petFriendliness: petFriendliness!,
        smokingPreference: smokingPreference!,
        travelFrequency: travelFrequency!,
        studyLocation: studyLocation!
      };

      await saveLifestyleQuiz(userId, lifestyleData);
      navigate('/profile/community-interests', { state: { userId } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save lifestyle quiz');
    }
  };

  const renderQuestion = (
    key: string,
    label: string,
    value: number | null,
    setValue: (val: number) => void,
    lowEmoji: string,
    highEmoji: string
  ) => (
    <div className="space-y-2">
      <label htmlFor={key} className="text-sm text-gray-700">
        {label}
      </label>
      <div className="flex justify-between items-center mb-1">
        <span aria-hidden="true">{lowEmoji}</span>
        <span aria-hidden="true">{highEmoji}</span>
      </div>
      <input
        id={key}
        type="range"
        min={0}
        max={10}
        step={1}
        value={value ?? 0}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
        aria-labelledby={`${key}-label`}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={value ?? 0}
      />
      <div className="text-xs text-gray-500 mt-1">
        {value !== null ? value : '-'}
      </div>
    </div>
  );

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-md p-6">
        <Button
          variant="outline"
          onClick={() => navigate('/profile/basic-details', { state: { userId } })}
          className="mb-6"
        >
          Back
        </Button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Lifestyle Quiz
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Help us understand your daily habits
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderQuestion('bedtime', 'What time do you usually go to bed?', bedtime, setBedtime, '🌙', '🌌')}
          {renderQuestion('wakeTime', 'What time do you usually wake up?', wakeTime, setWakeTime, '🛌', '🌅')}
          {renderQuestion('cleanliness', 'How tidy is your room?', cleanliness, setCleanliness, '🧹', '🧼')}
          {renderQuestion('noiseTolerance', 'How much noise can you tolerate?', noiseTolerance, setNoiseTolerance, '🤫', '🎉')}
          {renderQuestion('guestFrequency', 'How often do you host guests?', guestFrequency, setGuestFrequency, '🚪', '🍻')}
          {renderQuestion('petFriendliness', 'Do you like pets in the house?', petFriendliness, setPetFriendliness, '🚫', '🐾')}
          {renderQuestion('smokingPreference', 'Do you mind smoking in/around your room?', smokingPreference, setSmokingPreference, '🚭', '🚬')}
          {renderQuestion('travelFrequency', 'How frequently do you travel overnight?', travelFrequency, setTravelFrequency, '🏠', '✈️')}
          {renderQuestion('studyLocation', 'Where do you prefer to study?', studyLocation, setStudyLocation, '📚', '🏫')}

          <div className="pt-6">
            <Button
              type="submit"
              disabled={!allAnswered}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LifestyleQuiz;