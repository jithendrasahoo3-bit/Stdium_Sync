// ============================================================
// TRANSLATION ASSISTANT — Volunteer View
// AI-powered multilingual crowd instruction translator
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Languages, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { translateAlert } from '../../services/geminiService';
import { GlassPanel } from '../ui/GlassPanel';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { SUPPORTED_LANGUAGES } from '../../data/mockData';
import type { SupportedLanguage } from '../../types';

// ── Language Selector Button ──────────────────────────────
const LanguageButton = ({
  lang,
  isSelected,
  onClick,
}: {
  lang: typeof SUPPORTED_LANGUAGES[number];
  isSelected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-body font-medium transition-all duration-200 ${
      isSelected
        ? 'bg-cyber-teal/20 border-cyber-teal/60 text-cyber-teal shadow-cyber'
        : 'bg-cyber-blue/30 border-glass-border/50 text-slate-400 hover:border-cyber-teal/30 hover:text-slate-200'
    }`}
  >
    <span className="text-base">{lang.flag}</span>
    <span>{lang.label}</span>
  </motion.button>
);

// ── Translation Skeleton ──────────────────────────────────
const TranslationSkeleton = ({ language }: { language: string }) => (
  <GlassPanel glow="purple" className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-cyber-purple/20 animate-pulse flex items-center justify-center">
        <Languages className="w-5 h-5 text-cyber-purple animate-pulse" />
      </div>
      <div className="space-y-1.5 flex-1">
        <div className="h-3 w-1/3 bg-cyber-purple/20 rounded animate-pulse" />
        <div className="h-2 w-1/2 bg-cyber-blue/50 rounded animate-pulse" />
      </div>
    </div>
    <div className="space-y-1.5">
      <p className="font-mono text-xs text-cyber-purple/60 font-semibold tracking-wider">
        TRANSLATING TO {language.toUpperCase()}...
      </p>
      <SkeletonLoader lines={4} height="h-3" />
    </div>
    <div className="flex items-center gap-2">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-cyber-purple"
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1, delay }}
        />
      ))}
      <span className="font-mono text-xs text-cyber-purple">Gemini translating...</span>
    </div>
  </GlassPanel>
);

// ── Main Component ────────────────────────────────────────
export const TranslationAssistant = () => {
  const {
    aiAlerts,
    selectedAlertId,
    selectedLanguage,
    translationResult,
    isTranslating,
    translationError,
    setSelectedLanguage,
    setTranslationResult,
    setIsTranslating,
    setTranslationError,
  } = useAppStore();

  const [copied, setCopied] = useState(false);

  const selectedAlert = aiAlerts.find(a => a.id === selectedAlertId);
  const selectedLangData = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage);

  const handleTranslate = async () => {
    if (!selectedAlert || !selectedLanguage || !selectedLangData) return;

    setIsTranslating(true);
    setTranslationError(null);
    setTranslationResult(null);

    const textToTranslate = `${selectedAlert.title}: ${selectedAlert.recommendedAction}`;

    try {
      const result = await translateAlert(textToTranslate, selectedLanguage, selectedLangData.nativeName, selectedLangData.label);
      setTranslationResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Translation failed';
      setTranslationError(message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    if (translationResult) {
      navigator.clipboard.writeText(translationResult.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-white font-semibold text-base tracking-wide flex items-center gap-2">
        <div className="w-1 h-5 bg-purple-gradient rounded-full" />
        AI TRANSLATION ASSISTANT
        <Globe className="w-4 h-4 text-cyber-purple" />
      </h2>

      {/* Selected Alert Preview */}
      <AnimatePresence mode="wait">
        {selectedAlert ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <GlassPanel glow="teal" noPadding className="p-4">
              <p className="font-mono text-xs text-cyber-teal mb-1 font-semibold tracking-wider">SELECTED ALERT</p>
              <p className="font-display text-white font-semibold text-sm">{selectedAlert.title}</p>
              <p className="font-body text-slate-400 text-xs mt-1 leading-relaxed">{selectedAlert.recommendedAction}</p>
            </GlassPanel>
          </motion.div>
        ) : (
          <motion.div
            key="no-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="rounded-xl border border-dashed border-glass-border p-4 text-center">
              <p className="font-body text-slate-500 text-sm">
                ← Select an alert from the feed to translate
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Grid */}
      <div className="space-y-2">
        <p className="font-mono text-xs text-slate-500 tracking-wider font-semibold">SELECT FAN'S LANGUAGE</p>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORTED_LANGUAGES.map(lang => (
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

      {/* Translate Button */}
      <AnimatePresence>
        {selectedAlert && selectedLanguage && !isTranslating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={handleTranslate}
              className="group w-full relative overflow-hidden rounded-xl bg-cyber-purple/20 hover:bg-cyber-purple/30 border border-cyber-purple/40 hover:border-cyber-purple/70 transition-all duration-300 p-4 flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(123,97,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/0 via-cyber-purple/10 to-cyber-purple/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Languages className="w-5 h-5 text-cyber-purple relative z-10" />
              <div className="relative z-10">
                <p className="font-display text-white font-bold text-sm tracking-wide">TRANSLATE NOW</p>
                <p className="font-mono text-cyber-purple text-xs">
                  → {selectedLangData?.label} ({selectedLangData?.nativeName})
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-cyber-purple relative z-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Skeleton */}
      <AnimatePresence>
        {isTranslating && (
          <motion.div
            key="translating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TranslationSkeleton language={selectedLangData?.label ?? 'selected language'} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {translationError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassPanel glow="red" className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-cyber-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-cyber-red font-semibold text-sm">Translation Failed</p>
                <p className="font-body text-slate-400 text-xs mt-1">{translationError}</p>
                <button
                  onClick={handleTranslate}
                  className="mt-2 font-mono text-xs text-cyber-teal hover:text-white border border-cyber-teal/30 rounded px-3 py-1.5 transition-colors"
                >
                  RETRY
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Translation Result */}
      <AnimatePresence>
        {translationResult && !isTranslating && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <GlassPanel glow="purple" noPadding className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-cyber-purple font-semibold tracking-wider mb-1 flex items-center gap-2">
                    <Languages className="w-3 h-3" />
                    TRANSLATED TO {translationResult.languageLabel.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedLangData?.flag}</span>
                    <span className="font-body text-sm text-slate-400">{selectedLangData?.label}</span>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                    copied
                      ? 'border-cyber-green/50 text-cyber-green bg-cyber-green/10'
                      : 'border-glass-border text-slate-400 hover:border-cyber-purple/50 hover:text-slate-200'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>

              {/* Translated Text — Large and readable */}
              <div className="bg-black/30 rounded-xl p-4 border border-cyber-purple/20">
                <p className="font-body text-white text-base leading-relaxed" dir={translationResult.language === 'arabic' ? 'rtl' : 'ltr'}>
                  {translationResult.translatedText}
                </p>
              </div>

              {/* Original Reference */}
              <div className="bg-cyber-blue/20 rounded-lg p-3">
                <p className="font-mono text-xs text-slate-500 mb-1 tracking-wider">ORIGINAL (EN)</p>
                <p className="font-body text-xs text-slate-400 italic">{translationResult.originalText}</p>
              </div>

              {/* Cultural Note */}
              {translationResult.culturalNote && (
                <div className="flex items-start gap-2 bg-cyber-amber/5 border border-cyber-amber/20 rounded-lg p-3">
                  <span className="text-base flex-shrink-0">🌍</span>
                  <div>
                    <p className="font-mono text-xs text-cyber-amber font-semibold tracking-wider mb-0.5">CULTURAL NOTE</p>
                    <p className="font-body text-xs text-slate-400">{translationResult.culturalNote}</p>
                  </div>
                </div>
              )}

              <p className="font-mono text-xs text-slate-600 text-right">
                Generated {new Date(translationResult.generatedAt).toLocaleTimeString()}
              </p>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
