const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = Array.from(new Uint8Array(buffer));

  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });

  return window.btoa(binary);
};

export default arrayBufferToBase64;
