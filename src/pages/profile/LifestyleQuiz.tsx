import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { saveLifestyleQuiz } from '../../services/profile.service';

const LifestyleQuiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
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
    bedtime,
    wakeTime,
    cleanliness,
    noiseTolerance,
    guestFrequency,
    petFriendliness,
    smokingPreference,
    travelFrequency,
    studyLocation
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
          <div>
            <label htmlFor="bedtime" className="block text-sm font-medium text-gray-700 mb-1">
              What time do you usually go to bed?
            </label>
            <div className="flex justify-between items-center mb-1">
              <span aria-hidden="true">🌙</span>
              <span aria-hidden="true">🌌</span>
            </div>
            <input
              id="bedtime"
              type="range"
              min={0}
              max={10}
              step={1}
              value={bedtime ?? 0}
              onChange={(e) => setBedtime(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={bedtime ?? 0}
            />
            <p className="text-xs text-gray-500 mt-1">{bedtime ?? '-'}</p>
          </div>

          <div>
            <label htmlFor="wakeTime" className="block text-sm font-medium text-gray-700 mb-1">
              What time do you usually wake up?
            </label>
            <div className="flex justify-between items-center mb-1">
              <span aria-hidden="true">🛌</span>
              <span aria-hidden="true">🌅</span>
            </div>
            <input
              id="wakeTime"
              type="range"
              min={0}
              max={10}
              step={1}
              value={wakeTime ?? 0}
              onChange={(e) => setWakeTime(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={wakeTime ?? 0}
            />
            <p className="text-xs text-gray-500 mt-1">{wakeTime ?? '-'}</p>
          </div>

          <div>
            <label htmlFor="cleanliness" className="block text-sm font-medium text-gray-700 mb-1">
              How tidy is your room?
            </label>
            <div className="flex justify-between items-center mb-1">
              <span aria-hidden="true">🧹</span>
              <span aria-hidden="true">🧼</span>
            </div>
            <input
              id="cleanliness"
              type="range"
              min={0}
              max={10}
              step={1}
              value={cleanliness ?? 0}
              onChange={(e) => setCleanliness(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={cleanliness ?? 0}
            />
            <p className="text-xs text-gray-500 mt-1">{cleanliness ?? '-'}</p>
          </div>

          <div>
            <label htmlFor="noiseTolerance" className="block text-sm font-medium text-gray-700 mb-1">
              How much noise can you tolerate?
            </label>
            <div className="flex justify-between items-center mb-1">
              <span aria-hidden="true">🤫</span>
              <span aria-hidden="true">🎉</span>
            </div>
            <input
              id="noiseTolerance"
              type="range"
              min={0}
              max={10}
              step={1}
              value={noiseTolerance ?? 0}
              onChange={(e) => setNoiseTolerance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={noiseTolerance ?? 0}
            />
            <p className="text-xs text-gray-500 mt-1">{noiseTolerance ?? '-'}</p>
          </div>

          <div>
            <label htmlFor="guestFrequency" className="block text-sm font-medium text-gray-700 mb-1">
              How often do you host guests?
            </label>
            <div className="flex justify-between items-center mb-1">
              <span aria-hidden="true">🚪</span>
              <span aria-hidden="true">🍻</span>
            </div>
            <input
              id="guestFrequency"
              type="range"
              min={0}
              max={10}
              step={1}
              value={guestFrequency ?? 0}
              onChange={(e) => setGuestFrequency(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={guestFrequency ?? 0}
            />
            <p className="text-xs text-gray-500 mt-1">{guestFrequency ?? '-'}</p>
          </div>

          <div>
            <label htmlFor="petFriendliness" className="block text-sm font-medium text-gray-700 mb-1">
              Do you like pets in the house?
            </label>
            <div className="flex justify-between items-center mb-1">
              <span aria-hidden="true">🚫</span>
              <span aria-hidden="true">🐾</span>
            </div>
            <input
              id="petFriendliness"
              type="range"
              min={0}
              max={10}
              step={1}
              value={petFriendliness ?? 0}
              onChange={(e) => setPetFriendliness(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={petFriendliness ?? 0}
            />
            <p className="text-xs text-gray-500 mt-1">{petFriendliness ?? '-'}</p>
          </div>

          <div>
            <label htmlFor="smokingPreference" className="block text-sm font-medium text-gray-700 mb-1">
              Do you mind smoking in/around your room?
            </label>
            <div className="flex justify-between items-center mb-1">
              <span aria-hidden="true">🚭</span>
              <span aria-hidden="true">🚬</span>
            </div>
            <input
              id="smokingPreference"
              type="range"
              min={0}
              max={10}
              step={1}
              value={smokingPreference ?? 0}
              onChange={(e) => setSmokingPreference(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={smokingPreference ?? 0}
            />
            <p className="text-xs text-gray-500 mt-1">{smokingPreference ?? '-'}</p>
          </div>

          <div>
            <label htmlFor="travelFrequency" className="block text-sm font-medium text-gray-700 mb-1">
              How frequently do you travel overnight?
            </label>
            <div className="flex justify-between items-center mb-1">
              <span aria-hidden="true">🏠</span>
              <span aria-hidden="true">✈️</span>
            </div>
            <input
              id="travelFrequency"
              type="range"
              min={0}
              max={10}
              step={1}
              value={travelFrequency ?? 0}
              onChange={(e) => setTravelFrequency(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={travelFrequency ?? 0}
            />
            <p className="text-xs text-gray-500 mt-1">{travelFrequency ?? '-'}</p>
          </div>

          <div>
            <label htmlFor="studyLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Where do you prefer to study?
            </label>
            <div className="flex justify-between items-center mb-1">
              <span aria-hidden="true">📚</span>
              <span aria-hidden="true">🏫</span>
            </div>
            <input
              id="studyLocation"
              type="range"
              min={0}
              max={10}
              step={1}
              value={studyLocation ?? 0}
              onChange={(e) => setStudyLocation(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-primary"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={studyLocation ?? 0}
            />
            <p className="text-xs text-gray-500 mt-1">{studyLocation ?? '-'}</p>
          </div>

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