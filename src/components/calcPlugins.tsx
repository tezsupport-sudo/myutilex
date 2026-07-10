import React from 'react';
import { Calendar, Hourglass, Sparkles, Milestone, AlertTriangle, Copy, Check, Shield, ShieldCheck, RefreshCw } from 'lucide-react';

export interface CalcInputField {
  id: string;
  label: string;
  type: 'date' | 'number' | 'range' | 'checkbox' | 'select';
  defaultValue: any;
  min?: number;
  max?: number;
  options?: { label: string; value: any }[];
  placeholder?: string;
  helpText?: string;
}

export interface CalcPlugin {
  id: string;
  name: string;
  description: string;
  inputs: CalcInputField[];
  calculate: (inputs: Record<string, any>) => any;
  renderResults: (
    results: any,
    inputs: Record<string, any>,
    onChangeInput: (id: string, value: any) => void,
    triggerRecalculate?: () => void
  ) => React.ReactNode;
}

// 1. Age Calculator Plugin
const ageCalculatorPlugin: CalcPlugin = {
  id: 'age-calculator',
  name: 'Chronological Age Calculator',
  description: 'Calculate your exact age in years, months, days, hours, and weeks. Find zodiac signs, next birthday countdowns, and astronomical leap years.',
  inputs: [
    {
      id: 'dob',
      label: 'Date of Birth',
      type: 'date',
      defaultValue: '',
      placeholder: 'Select Birth Date'
    }
  ],
  calculate: (inputs) => {
    const dob = inputs.dob;
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      return { error: 'Birthdate cannot be in the future!' };
    }

    // Chronological exact age calculation
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Dynamic aggregated counters
    const timeDiff = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));

    // Zodiac Finder
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();
    let zodiac = 'Unknown';
    if ((birthMonth === 3 && birthDay >= 21) || (birthMonth === 4 && birthDay <= 19)) zodiac = 'Aries ♈';
    else if ((birthMonth === 4 && birthDay >= 20) || (birthMonth === 5 && birthDay <= 20)) zodiac = 'Taurus ♉';
    else if ((birthMonth === 5 && birthDay >= 21) || (birthMonth === 6 && birthDay <= 20)) zodiac = 'Gemini ♊';
    else if ((birthMonth === 6 && birthDay >= 21) || (birthMonth === 7 && birthDay <= 22)) zodiac = 'Cancer ♋';
    else if ((birthMonth === 7 && birthDay >= 23) || (birthMonth === 8 && birthDay <= 22)) zodiac = 'Leo ♌';
    else if ((birthMonth === 8 && birthDay >= 23) || (birthMonth === 9 && birthDay <= 22)) zodiac = 'Virgo ♍';
    else if ((birthMonth === 9 && birthDay >= 23) || (birthMonth === 10 && birthDay <= 22)) zodiac = 'Libra ♎';
    else if ((birthMonth === 10 && birthDay >= 23) || (birthMonth === 11 && birthDay <= 21)) zodiac = 'Scorpio ♏';
    else if ((birthMonth === 11 && birthDay >= 22) || (birthMonth === 12 && birthDay <= 21)) zodiac = 'Sagittarius ♐';
    else if ((birthMonth === 12 && birthDay >= 22) || (birthMonth === 1 && birthDay <= 19)) zodiac = 'Capricorn ♑';
    else if ((birthMonth === 1 && birthDay >= 20) || (birthMonth === 2 && birthDay <= 18)) zodiac = 'Aquarius ♒';
    else if ((birthMonth === 2 && birthDay >= 19) || (birthMonth === 3 && birthDay <= 20)) zodiac = 'Pisces ♓';

    // Leap Year Calculation
    const bYear = birthDate.getFullYear();
    const isLeapYear = (bYear % 4 === 0 && bYear % 100 !== 0) || bYear % 400 === 0;

    // Next Birthday Countdown
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today > nextBday) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const diffNext = nextBday.getTime() - today.getTime();
    const nextBirthdayDays = Math.ceil(diffNext / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      zodiac,
      isLeapYear,
      nextBirthdayDays,
    };
  },
  renderResults: (results) => {
    if (!results) return null;

    if (results.error) {
      return (
        <div className="flex items-start space-x-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 animate-fadeIn" id="age-error-banner">
          <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-500" />
          <div className="font-mono">{results.error}</div>
        </div>
      );
    }

    return (
      <div className="space-y-6" id="age-results-container">
        {/* Main Chronological Exact Age Row */}
        <div className="grid grid-cols-3 gap-3" id="age-main-stats">
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <span className="block font-mono text-[9px] font-bold text-gray-500 uppercase tracking-widest">Years</span>
            <span className="mt-1 block font-sans text-2xl font-extrabold text-gray-950 sm:text-3xl">{results.years}</span>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <span className="block font-mono text-[9px] font-bold text-gray-500 uppercase tracking-widest">Months</span>
            <span className="mt-1 block font-sans text-2xl font-extrabold text-gray-950 sm:text-3xl">{results.months}</span>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm">
            <span className="block font-mono text-[9px] font-bold text-gray-500 uppercase tracking-widest">Days</span>
            <span className="mt-1 block font-sans text-2xl font-extrabold text-gray-950 sm:text-3xl">{results.days}</span>
          </div>
        </div>

        {/* Birthday Countdown Tracker */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 flex items-center space-x-4" id="age-birthday-countdown">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <Hourglass className="animate-spin-slow" size={18} />
          </div>
          <div>
            <span className="block font-mono text-[10px] font-bold text-amber-700 uppercase tracking-widest">Birthday Countdown</span>
            <p className="mt-0.5 font-sans text-sm text-gray-700">
              Your next birthday is in <strong className="font-semibold text-amber-900">{results.nextBirthdayDays}</strong> {results.nextBirthdayDays === 1 ? 'day' : 'days'}. Prepare the celebration!
            </p>
          </div>
        </div>

        {/* Aggregate Life Stats & Fun Milestones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="age-lifespan-grid">
          {/* Lifespan Aggregate Cards */}
          <div className="rounded-lg border border-gray-200 p-4 space-y-3.5 bg-white">
            <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1">
              <Milestone size={12} />
              <span>Life aggregate counters</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-gray-50 pb-1.5">
                <span className="text-gray-500">Total hours lived</span>
                <span className="font-mono font-medium text-gray-900">{results.totalHours.toLocaleString()} hrs</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1.5">
                <span className="text-gray-500">Total weeks lived</span>
                <span className="font-mono font-medium text-gray-900">{results.totalWeeks.toLocaleString()} weeks</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1.5">
                <span className="text-gray-500">Total days lived</span>
                <span className="font-mono font-medium text-gray-900">{results.totalDays.toLocaleString()} days</span>
              </div>
            </div>
          </div>

          {/* Birthday Fun Facts Cards */}
          <div className="rounded-lg border border-gray-200 p-4 space-y-3.5 bg-white">
            <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1">
              <Sparkles size={12} className="text-gray-400" />
              <span>Cosmic & astronomical facts</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-gray-50 pb-1.5">
                <span className="text-gray-500">Astrological sign</span>
                <span className="font-sans font-medium text-gray-900">{results.zodiac}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1.5">
                <span className="text-gray-500">Born in leap year</span>
                <span className="font-sans font-medium text-gray-900">{results.isLeapYear ? 'Yes ✅' : 'No ❌'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1.5">
                <span className="text-gray-500">Current planet home</span>
                <span className="font-sans font-medium text-gray-900">Earth 🌍</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

// Helper inside the password generator file to implement secure crypto random values
const getRandomNumber = (max: number) => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
};

// 2. Password Generator Plugin
const passwordGeneratorPlugin: CalcPlugin = {
  id: 'password-generator',
  name: 'Cryptographically Secure Password Generator',
  description: 'Generate high-entropy secure passwords using hardware-backed cryptographically secure pseudo-random number generators (CSPRNG).',
  inputs: [
    {
      id: 'length',
      label: 'Password Length',
      type: 'range',
      defaultValue: 16,
      min: 8,
      max: 64
    },
    {
      id: 'includeUppercase',
      label: 'Uppercase Letters (A-Z)',
      type: 'checkbox',
      defaultValue: true
    },
    {
      id: 'includeLowercase',
      label: 'Lowercase Letters (a-z)',
      type: 'checkbox',
      defaultValue: true
    },
    {
      id: 'includeNumbers',
      label: 'Numbers (0-9)',
      type: 'checkbox',
      defaultValue: true
    },
    {
      id: 'includeSymbols',
      label: 'Special Symbols (!@#$)',
      type: 'checkbox',
      defaultValue: true
    }
  ],
  calculate: (inputs) => {
    const length = Number(inputs.length || 16);
    const includeUppercase = !!inputs.includeUppercase;
    const includeLowercase = !!inputs.includeLowercase;
    const includeNumbers = !!inputs.includeNumbers;
    const includeSymbols = !!inputs.includeSymbols;

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let characterPool = '';
    let guaranteedChars = '';

    if (includeUppercase) {
      characterPool += uppercaseChars;
      guaranteedChars += uppercaseChars.charAt(getRandomNumber(uppercaseChars.length));
    }
    if (includeLowercase) {
      characterPool += lowercaseChars;
      guaranteedChars += lowercaseChars.charAt(getRandomNumber(lowercaseChars.length));
    }
    if (includeNumbers) {
      characterPool += numberChars;
      guaranteedChars += numberChars.charAt(getRandomNumber(numberChars.length));
    }
    if (includeSymbols) {
      characterPool += symbolChars;
      guaranteedChars += symbolChars.charAt(getRandomNumber(symbolChars.length));
    }

    if (characterPool.length === 0) {
      return { password: '', strength: { score: 0, label: 'Weak', colorClass: 'bg-red-500 w-1/4' } };
    }

    let generatedPassword = guaranteedChars;
    const remainingLength = length - guaranteedChars.length;

    // Cryptographically secure generation
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = getRandomNumber(characterPool.length);
      generatedPassword += characterPool.charAt(randomIndex);
    }

    // Shuffle password
    const shuffledPassword = generatedPassword
      .split('')
      .sort(() => getRandomNumber(2) - 0.5)
      .join('');

    // Strength audit
    let score = 0;
    if (shuffledPassword.length >= 8) score += 1;
    if (shuffledPassword.length >= 14) score += 1;
    if (/[A-Z]/.test(shuffledPassword)) score += 1;
    if (/[a-z]/.test(shuffledPassword)) score += 1;
    if (/[0-9]/.test(shuffledPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(shuffledPassword)) score += 1;

    let label = 'Weak';
    let colorClass = 'bg-red-500 w-1/4';

    if (score >= 5 && shuffledPassword.length >= 12) {
      label = 'Very Strong';
      colorClass = 'bg-emerald-500 w-full';
    } else if (score >= 4) {
      label = 'Strong';
      colorClass = 'bg-teal-500 w-3/4';
    } else if (score >= 2) {
      label = 'Medium';
      colorClass = 'bg-amber-500 w-1/2';
    }

    return {
      password: shuffledPassword,
      strength: { score, label, colorClass }
    };
  },
  renderResults: (results, inputs, onChangeInput, triggerRecalculate) => {
    const [copied, setCopied] = React.useState(false);

    if (!results || !results.password) {
      return (
        <div className="text-center p-4 font-mono text-xs text-gray-400">
          Select criteria to generate password...
        </div>
      );
    }

    const handleCopy = () => {
      navigator.clipboard.writeText(results.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="space-y-6" id="calc-password-results">
        {/* Generated Password Result Banner */}
        <div className="relative flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/80 p-4 font-mono text-sm tracking-wide text-gray-800" id="pwd-output-banner">
          {copied && (
            <div className="absolute right-12 -top-3 z-10 flex items-center space-x-1 rounded-full bg-emerald-600 px-2.5 py-0.5 font-sans text-[10px] font-bold text-white shadow-md animate-bounce">
              <Check size={10} className="stroke-[3px]" />
              <span>Copied!</span>
            </div>
          )}
          <span className="break-all font-semibold select-all pr-8" id="generated-password-value">
            {results.password}
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={triggerRecalculate}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-200/50 hover:text-gray-900 transition-colors"
              title="Generate New Password"
            >
              <RefreshCw size={15} className="hover:rotate-180 transition-transform duration-500 ease-out" />
            </button>
            <button
              onClick={handleCopy}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-200/50 hover:text-gray-950 transition-colors"
              title="Copy Password"
            >
              {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        {/* Live Strength Indicator */}
        <div className="space-y-1.5" id="pwd-strength-container">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-400 font-mono uppercase tracking-widest flex items-center space-x-1">
              {results.strength.label === 'Very Strong' ? (
                <ShieldCheck size={12} className="text-emerald-500" />
              ) : (
                <Shield size={12} className="text-gray-400" />
              )}
              <span>Entropy Score</span>
            </span>
            <span className={results.strength.label === 'Weak' ? 'text-red-600' : results.strength.label === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}>
              {results.strength.label}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${results.strength.colorClass}`} />
          </div>
        </div>
      </div>
    );
  }
};

export const CALC_PLUGINS: Record<string, CalcPlugin> = {
  'age-calculator': ageCalculatorPlugin,
  'password-generator': passwordGeneratorPlugin
};
