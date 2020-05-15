const hasChars = (text, firstLetterCharCode, lastLetterCharCode) => {
  const processedText = text.toLowerCase();
  const textArray = processedText.split('');

  return textArray.some((char) => {
    const charCode = char.charCodeAt();
    const hasChar = charCode >= firstLetterCharCode && charCode <= lastLetterCharCode;

    return hasChar;
  });
};

const hasRussianChars = (text) => {
  const FIRST_LETTER = 'а';
  const FIRST_LETTER_CODE = FIRST_LETTER.charCodeAt();
  const LAST_LETTER = 'я';
  const LAST_LETTER_CODE = LAST_LETTER.charCodeAt();

  return hasChars(text, FIRST_LETTER_CODE, LAST_LETTER_CODE);
};

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = Array.from(new Uint8Array(buffer));

  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });

  return window.btoa(binary);
};

const getBase64Data = async (imageSrc, flag = 'data:image/jpeg;base64') => {
  try {
    const response = await fetch(imageSrc);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = `${flag},${arrayBufferToBase64(arrayBuffer)}`;

    return base64;
  } catch (e) {
    return undefined;
  }
};

const getImage = async (imageSrc, defaultSrc) => {
  const imageBase64 = await getBase64Data(imageSrc);

  return imageBase64 ? imageSrc : defaultSrc;
};

const getRatingColor = (rating) => {
  const ratingNumber = Number(rating);
  const BAD = '#c70303';
  const NEUTRAL = '#5f5f5f';
  const GOOD = '#007b00';

  if (ratingNumber < 5) { return BAD; }
  if (ratingNumber < 7) { return NEUTRAL; }
  return GOOD;
};

const hasData = (data, noData) => data !== noData;

const isUndefined = (item) => item === undefined;

module.exports = {
  hasRussianChars,
  arrayBufferToBase64,
  getBase64Data,
  getImage,
  getRatingColor,
  hasData,
  isUndefined,
};
