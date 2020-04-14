const trash = async () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve('готово!'), 1000);
  });

  const result = await promise;

  alert(result); // "готово!"
};

export default trash;
