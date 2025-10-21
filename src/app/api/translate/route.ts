import { NextRequest } from 'next/server';

const translationCache = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const targetLang = searchParams.get('targetLang') 




    if (!text || !targetLang) {
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    const cacheKey = `${text}-${targetLang}`;
    if (translationCache.has(cacheKey)) {
      return Response.json({ translatedText: translationCache.get(cacheKey) });
    }
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );

    if (!response.ok) {
      throw new Error('Translation API error');
    }

    const data = await response.json();
    const translatedText = data[0]?.[0]?.[0] || text;

    // Salvar no cache (expira após 1 hora)
    translationCache.set(cacheKey, translatedText);
    setTimeout(() => translationCache.delete(cacheKey), 60 * 60 * 1000);

    return Response.json({ translatedText });

  } catch (error) {
    console.error('Translation error:', error);
    return Response.json({ error: "Translation failed" }, { status: 500 });
  }
}