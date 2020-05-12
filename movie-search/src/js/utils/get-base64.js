import arrayBufferToBase64 from './arraybuffer-to-base64';

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

export default getBase64Data;
