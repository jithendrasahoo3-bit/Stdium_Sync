import { useState } from 'react';
import { Languages, AlertCircle, Copy, Check, Globe } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translateAlert } from '../../services/geminiService';
import { SUPPORTED_LANGUAGES } from '../../data/mockData';
import type { SupportedLanguage } from '../../types';

interface LanguageButtonProps {
  lang: (typeof SUPPORTED_LANGUAGES)[number];
  isSelected: boolean;
  onClick: () => void;
}

const LanguageButton = ({ lang, isSelected, onClick }: LanguageButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all duration-150 ${
      isSelected
        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
    }`}
  >
    <span className="text-base">{lang.flag}</span>
    <span className="truncate">{lang.label}</span>
  </button>
);

export const TranslationAssistant = () => {
  const {
    aiAlerts,
    selectedAlertId,
    selectedLanguage,
    setSelectedLanguage,
    translationResult,
    setTranslationResult,
    isTranslating,
    setIsTranslating,
    translationError,
    setTranslationError,
  } = useAppStore();

  const [copied, setCopied] = useState(false);

  const selectedAlert = aiAlerts.find((a) => a.id === selectedAlertId);
  const selectedLangData = SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage);

  const handleTranslate = async () => {
    if (!selectedAlert || !selectedLanguage || !selectedLangData) return;

    setIsTranslating(true);
    setTranslationError(null);
    try {
      const textToTranslate = `${selectedAlert.title}. ${selectedAlert.recommendedAction}`;
      const result = await translateAlert(
        textToTranslate,
        selectedLanguage,
        selectedLangData.nativeName,
        selectedLangData.label
      );
      setTranslationResult(result);
    } catch (err) {
      setTranslationError((err as Error)?.message ?? 'Translation request failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async () => {
    if (!translationResult) return;
    try {
      await navigator.clipboard.writeText(translationResult.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  return (
    <div className="space-y-4">
      {/* Alert Context */}
      {selectedAlert ? (
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
          <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">Selected Concourse Alert</p>
          <p className="font-bold text-slate-900 text-sm">{selectedAlert.title}</p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedAlert.recommendedAction}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center bg-slate-50/50">
          <Languages className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-500">
            Select an alert from the alert list on the left to translate for international fans
          </p>
        </div>
      )}

      {/* Language Grid */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Fan Language</p>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <LanguageButton
              key={lang.id}
              lang={lang}
              isSelected={selectedLanguage === lang.id}
              onClick={() => {
                setSelectedLanguage(lang.id as SupportedLanguage);
                setTranslationResult(null);
                setTranslationError(null);
              }}
            />
          ))}
        </div>
      </div>

      {/* Action Button */}
      {selectedAlert && selectedLanguage && !isTranslating && (
        <button
          type="button"
          onClick={handleTranslate}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all p-3.5 flex items-center justify-center gap-2 shadow-sm"
        >
          <Languages className="w-4 h-4" />
          <span>Translate for Spectator &rarr; {selectedLangData?.label}</span>
        </button>
      )}

      {/* Translating State */}
      {isTranslating && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-2 shadow-sm">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-700">
            Translating announcement into {selectedLangData?.label ?? 'selected language'}...
          </p>
        </div>
      )}

      {/* Error Display */}
      {translationError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900 text-sm">Translation Failed</p>
            <p className="text-xs text-red-700 mt-1">{translationError}</p>
            <button
              type="button"
              onClick={handleTranslate}
              className="mt-2 text-xs font-semibold text-red-800 border border-red-300 rounded px-2.5 py-1 bg-white hover:bg-red-50"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Output Panel */}
      {translationResult && !isTranslating && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedLangData?.flag}</span>
              <div>
                <p className="font-bold text-slate-900 text-sm">{translationResult.languageLabel}</p>
                <p className="text-[11px] text-slate-500">{selectedLangData?.nativeName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                copied
                  ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p
              className="text-base text-slate-900 font-medium leading-relaxed"
              dir={translationResult.language === 'arabic' ? 'rtl' : 'ltr'}
            >
              {translationResult.translatedText}
            </p>
          </div>

          <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Original (English)</p>
            <p className="text-xs text-slate-600 italic leading-relaxed">{translationResult.originalText}</p>
          </div>

          {translationResult.culturalNote && (
            <div className="flex items-start gap-2 bg-amber-50/70 border border-amber-200 rounded-lg p-3">
              <Globe className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <p className="font-bold uppercase tracking-wider text-[10px] text-amber-800">Cultural &amp; Phrasing Note</p>
                <p className="mt-0.5 leading-relaxed">{translationResult.culturalNote}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

