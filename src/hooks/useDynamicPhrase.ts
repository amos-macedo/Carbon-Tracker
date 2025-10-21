import { useState, useCallback } from 'react';
import { COUNTRY_TO_LANGUAGE } from '@/utils/country-lng';
import { BASE_PHRASES } from '@/utils/baseFhrase';

export const useDynamicPhrase = () => {
  const [dynamicPhrase, setDynamicPhrase] = useState("🌞 Um ótimo dia para caminhar e aproveitar o sol!");

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'pt') return text;

    try {
      const response = await fetch(
        `/api/translate?text=${encodeURIComponent(text)}&targetLang=${targetLang === '' ? 'pt' : targetLang}`
      );
      
      if (!response.ok) throw new Error('Translation failed');
      
      const data = await response.json();
      return data.translatedText || text;
      
    } catch (error) {
      console.warn('Erro na tradução:', error);
      return text;
    }
  };

  const getTemperatureCategory = (temp: number) => {
    if (temp >= 30) return "hot";
    if (temp >= 25) return "warm";
    if (temp >= 18) return "mild";
    if (temp >= 10) return "cool";
    return "cold";
  };

  const generateDynamicPhrase = useCallback(async (temp: number, countryCode: string) => {
    const category = getTemperatureCategory(temp);
    const phrases = BASE_PHRASES[category as keyof typeof BASE_PHRASES];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const targetLanguage = COUNTRY_TO_LANGUAGE[countryCode] || "pt";

    if (targetLanguage !== "pt") {
      try {
        const translatedPhrase = await translateText(randomPhrase, targetLanguage);
        setDynamicPhrase(translatedPhrase);
      } catch (error) {
        setDynamicPhrase(randomPhrase);
      }
    } else {
      setDynamicPhrase(randomPhrase);
    }
  }, []);

  return {
    dynamicPhrase,
    generateDynamicPhrase
  };
};