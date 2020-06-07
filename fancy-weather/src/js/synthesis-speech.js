const parseString = () => {
  const [today] = document.getElementsByClassName('forecast-container__today');
  const [week] = document.getElementsByClassName('forecast-container__week');

  let text = `${today.textContent} ${week.textContent}`;
  text = text.trim().replace(/Your browser does not support SVGs/g, ' ');
  text = text.replace(/\s/g, ' ');
  text = text.split(' ').filter((item) => item).join(' ');

  return text;
};

class SpeechSynthesis {
  constructor() {
    const utterance = new SpeechSynthesisUtterance();

    utterance.rate = 1.5;
    utterance.volume = 1;

    this.utterance = utterance;
    this.changeLanguage();
  }

  changeLanguage() {
    const pageLanguage = localStorage.getItem('pageLanguage');
    const mapper = {
      be: 'be-BY',
      ru: 'ru-RU',
      en: 'en-US',
    };

    this.utterance.lang = mapper[pageLanguage];
  }

  // eslint-disable-next-line class-methods-use-this
  stopSpeaker() {
    window.speechSynthesis.pause();
    window.speechSynthesis.cancel();
  }

  speakIt() {
    const isSpeaking = window.speechSynthesis.speaking;

    if (isSpeaking) {
      this.stopSpeaker();
    } else {
      this.changeLanguage();

      const textContent = parseString();

      this.utterance.text = textContent;

      window.speechSynthesis.speak(this.utterance);
    }
  }

  setVolume(volume) {
    this.utterance.volume = volume;
  }

  decreaseVolume() {
    this.utterance.volume -= 0.3;

    const isOutOfLowerBound = this.utterance.volume < 0;

    if (isOutOfLowerBound) {
      this.utterance.volume = 0;
    }
  }

  increaseVolume() {
    this.utterance.volume += 0.3;

    const isOutOfUpperBound = this.utterance.volume > 1;

    if (isOutOfUpperBound) {
      this.utterance.volume = 1;
    }
  }
}

export default SpeechSynthesis;
