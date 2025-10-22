import { useState, useCallback } from 'react';
import { COUNTRY_TO_LANGUAGE } from '@/utils/country-lng';
import { BASE_PHRASES } from '@/utils/baseFhrase';

export type DynamicPhraseType = {
  dynamicPhrase: string;
  ptVersion: string;
}
export const useDynamicPhrase = () => {
  const [dynamicPhrase, setDynamicPhrase] = useState<DynamicPhraseType >( {
    dynamicPhrase: '',
    ptVersion: ''
  });

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
  const cleanPhrase = (text: string): string => {

    return text
      .replace(/^\p{Emoji}\s*/u, '')  
      .replace(/[.!?]\s*$/, '')        
      .trim();
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
    const targetLanguage = countryCode ? (COUNTRY_TO_LANGUAGE[countryCode] || "pt") : "pt";


    const cleanedPhrase = cleanPhrase(randomPhrase);

    if (targetLanguage !== "pt") {
      try {
        const translatedPhrase = await translateText(randomPhrase, targetLanguage);
        setDynamicPhrase({ dynamicPhrase: translatedPhrase, ptVersion: cleanedPhrase });
      } catch (error) {
        setDynamicPhrase({ dynamicPhrase: randomPhrase, ptVersion: cleanedPhrase });
      }
    } else {
      setDynamicPhrase({ dynamicPhrase: randomPhrase, ptVersion: "" });
    }
  }, []);

  return {
    dynamicPhrase,
    generateDynamicPhrase
  };
};