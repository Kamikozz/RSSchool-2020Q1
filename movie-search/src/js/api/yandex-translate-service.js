import { yandexTranslateApi } from '../credentials';

// https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200427T065631Z.0c10983194239a87.e571e7bd7d82365b43142a166f902ab5f37ea1dd&text=русский&lang=ru-en
const getTranslation = async (sentence, lang = 'ru-en') => {
  const { baseUrl, apiKey } = yandexTranslateApi;
  const processedSentence = encodeURIComponent(String(sentence).trim());
  const params = `key=${apiKey}&text=${processedSentence}&lang=${lang}`;
  const url = `${baseUrl}?${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export default getTranslation;
