const toggleLoader = () => {
  const [loader] = document.body.getElementsByClassName('loader');
  loader.classList.toggle('loader_hidden');
};

export default {
  toggleLoader,
};
