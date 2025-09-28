'use client'
import Image from 'next/image'
import React, { useState } from 'react'

export default function InterestSelection() {
  const [currentStep, setCurrentStep] = useState(4);
  const [totalSteps] = useState(5);
  const [progress, setProgress] = useState(20);

  const [selectedGender, setSelectedGender] = useState('');
  const [ageRange, setageRange] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [networkPreference, setNetworkPreference] = useState('');
  const [timeAvailability, setTimeAvailability] = useState('');

  const ageRanges = [
    { value: "13-17", label: "13-17 years" },
    { value: "18-24", label: "18-24 years" },
    { value: "25-34", label: "25-34 years" },
    { value: "35-44", label: "35-44 years" },
    { value: "45-54", label: "45-54 years" },
    { value: "55-64", label: "55-64 years" },
    { value: "65+", label: "65+ years" }
  ];

  const interests = [
    { value: "technology", label: "Technology" },
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" },
    { value: "movies", label: "Movies & Entertainment" },
    { value: "food", label: "Food & Cooking" },
    { value: "travel", label: "Travel" },
    { value: "fashion", label: "Fashion" },
    { value: "fitness", label: "Health & Fitness" },
    { value: "business", label: "Business" },
    { value: "art", label: "Art & Design" },
    { value: "gaming", label: "Gaming" },
    { value: "books", label: "Books & Literature" },
    { value: "science", label: "Science" },
    { value: "politics", label: "Politics" },
    { value: "nature", label: "Nature & Environment" }
  ];

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setProgress((newStep / totalSteps) * 100);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setProgress((newStep / totalSteps) * 100);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleSubmissionLogic = () => {
    console.log('Form submission triggered');
    console.log('Selected Gender:', selectedGender);
    console.log('Age Range:', ageRange);
    console.log('Selected Interests:', selectedInterests);
    console.log('Network Preference:', networkPreference);
    console.log('Time Availability:', timeAvailability);
  };

  return (
    <div className="h-10/11 md:w-1/2 flex flex-col border-none rounded-md md:ml-72 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="relative h-11/12 mt-5 rounded-lg">
        {/* Top Navigation with Progress Bar */}
        <section className="w-full h-12 border-none rounded-lg flex items-center justify-between py-9 px-4">
          <span
            className={`hover:bg-yellow-300 dark:hover:bg-yellow-500/20 border border-yellow-500 cursor-pointer p-2 rounded-full ${currentStep === 1 ? 'invisible' : 'block'}`}
            onClick={handlePreviousStep}
          >
            <Image className='dark:invert' src="/images/arrow.png" width={25} height={25} alt="back-arrow" />
          </span>

          <div className="flex flex-col items-center justify-center px-4">
            <div className="w-64 h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-200 to-yellow-400 dark:from-yellow-400 dark:to-yellow-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">
              {currentStep} out of {totalSteps}
            </span>
          </div>

          <span
            className={`hover:bg-yellow-300 dark:hover:bg-yellow-500/20 border border-yellow-500 cursor-pointer p-2 rounded-full rotate-180 ${currentStep === 5 ? 'invisible' : 'block'}`}
            onClick={handleNextStep}
          >
            <Image className='dark:invert' src="/images/arrow.png" width={25} height={25} alt="front-arrow" />
          </span>
        </section>

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="card-1 text-center flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 justify-center font-semibold text-2xl text-gray-900 dark:text-white">
              <span>What is your Gender ??</span>
              <Image src="/images/gender.png" height={40} width={40} alt="gender-selection" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Select your gender for accessing better content.</p>

            <div className="flex flex-col gap-3 mt-4 mx-2">
              {["male", "female", "none"].map((gender) => (
                <label key={gender} className="flex items-center justify-between w-full border border-gray-200 dark:border-slate-700 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-900 focus-within:ring-2 focus-within:ring-yellow-400">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={selectedGender === gender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="appearance-none cursor-pointer w-5 h-5 rounded-full border border-gray-400 dark:border-slate-600 checked:border-[6px] checked:border-yellow-500 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                    <span className="text-base font-medium text-gray-800 dark:text-gray-200 capitalize">
                      {gender === "none" ? "Rather not to say" : gender}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="absolute bottom-0 w-full py-3 flex items-center justify-center border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => { setCurrentStep(currentStep + 1) }}
                className="cursor-pointer text-lg font-semibold w-1/2 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-400 text-gray-900 rounded-lg p-2"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="card-2 text-center flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 justify-center font-semibold text-2xl text-gray-900 dark:text-white">
              <span>Where is your Age lying ??</span>
              <Image className='dark:invert' src="/images/age-range.png" height={40} width={40} alt="age-range" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">By your age range we get to know about your mind level and understanding.</p>

            <div className="grid grid-cols-2 grid-rows-4 gap-3 mt-4 mx-2">
              {ageRanges.map((age) => (
                <label key={age.value} className="flex items-center justify-between w-full border border-gray-200 dark:border-slate-700 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-900 focus-within:ring-2 focus-within:ring-yellow-400">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="ageRange"
                      value={age.value}
                      checked={ageRange === age.value}
                      onChange={(e) => setageRange(e.target.value)}
                      className="appearance-none cursor-pointer w-5 h-5 rounded-full border border-gray-400 dark:border-slate-600 checked:border-[6px] checked:border-yellow-500 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                    <span className="text-base font-medium text-gray-800 dark:text-gray-200">{age.label}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="absolute w-full py-3 bottom-0 left-0 flex items-center justify-center border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => { setCurrentStep(currentStep + 1) }}
                className="cursor-pointer text-lg font-semibold w-1/2 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-400 text-gray-900 rounded-lg p-2"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="card-3 text-center flex flex-col gap-2.5 h-full">
            <div className="flex items-center gap-2.5 justify-center font-semibold text-2xl text-gray-900 dark:text-white">
              <span>What are you interested in ??</span>
              <Image className='dark:invert' src="/images/interest.png" height={40} width={40} alt="interest-selection" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Select all categories that interest you for personalized content recommendations.</p>

            <div className="flex-1 overflow-y-auto px-2 pb-4">
              <div className="grid grid-cols-3 gap-3 mt-4">
                {interests.map((interest) => (
                  <label key={interest.value} className="flex items-center justify-between w-full border border-gray-200 dark:border-slate-700 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-900 focus-within:ring-2 focus-within:ring-yellow-400">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="interests"
                        value={interest.value}
                        checked={selectedInterests.includes(interest.value)}
                        onChange={(e) => handleInterestToggle(e.target.value)}
                        className="appearance-none cursor-pointer w-5 h-5 rounded border border-gray-400 dark:border-slate-600 checked:bg-yellow-500 checked:border-yellow-500 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      />
                      <span className="text-base font-medium text-gray-800 dark:text-gray-200">{interest.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="absolute w-full py-3 bottom-0 left-0 flex items-center justify-center border-t border-gray-100 dark:border-slate-800">
                <button
                  onClick={() => { setCurrentStep(currentStep + 1) }}
                  className="cursor-pointer text-lg font-semibold w-1/2 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-400 text-gray-900 rounded-lg p-2"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="card-4 text-center flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 justify-center font-semibold text-2xl text-gray-900 dark:text-white">
              <span>Main reason for using Briezly ??</span>
              <Image className='dark:invert' src="/images/people.png" height={40} width={40} alt="network-preference" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose your suitable reason for joining Briezly social media platform.</p>

            <div className="flex flex-col gap-3 mt-4 mx-2">
              {[
                { value: "close-friends", label: "Connecting with friends & family" },
                { value: "professional-network", label: "Professional networking" },
                { value: "public-audience", label: "Public audience & General entertainment" }
              ].map((option) => (
                <label key={option.value} className="flex items-center justify-between w-full border border-gray-200 dark:border-slate-700 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-900 focus-within:ring-2 focus-within:ring-yellow-400">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="networkPreference"
                      value={option.value}
                      checked={networkPreference === option.value}
                      onChange={(e) => setNetworkPreference(e.target.value)}
                      className="appearance-none cursor-pointer w-5 h-5 rounded-full border border-gray-400 dark:border-slate-600 checked:border-[6px] checked:border-yellow-500 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                    <span className="text-base font-medium text-gray-800 dark:text-gray-200">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="absolute bottom-0 w-full py-3 flex items-center justify-center border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => { setCurrentStep(currentStep + 1) }}
                className="cursor-pointer text-lg font-semibold w-1/2 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-400 text-gray-900 rounded-lg p-2"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {currentStep === 5 && (
          <div className="card-5 text-center flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 justify-center font-semibold text-2xl text-gray-900 dark:text-white">
              <span>When are you most active?</span>
              <Image className='dark:invert' src="/images/hourglass.png" height={40} width={40} alt="time-availability" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Select when you're typically most active on social media for better content timing.</p>

            <div className="flex flex-col gap-3 mt-4 mx-2">
              {[
                { value: "morning", label: "Morning (6 AM - 12 PM)" },
                { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
                { value: "evening", label: "Evening (5 PM - 10 PM)" },
                { value: "night-owl", label: "Night Owl (10 PM - 6 AM)" }
              ].map((time) => (
                <label key={time.value} className="flex items-center justify-between w-full border border-gray-200 dark:border-slate-700 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-900 focus-within:ring-2 focus-within:ring-yellow-400">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="timeAvailability"
                      value={time.value}
                      checked={timeAvailability === time.value}
                      onChange={(e) => setTimeAvailability(e.target.value)}
                      className="appearance-none cursor-pointer w-5 h-5 rounded-full border border-gray-400 dark:border-slate-600 checked:border-[6px] checked:border-yellow-500 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                    <span className="text-base font-medium text-gray-800 dark:text-gray-200">{time.label}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="absolute bottom-0 w-full py-3 flex items-center justify-center border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => { handleSubmissionLogic() }}
                className="cursor-pointer text-lg font-semibold w-1/2 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-400 text-gray-900 rounded-lg p-2"
              >
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
