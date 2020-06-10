import errorHandler from './error-handler';
import getBackgroundData from './api/unsplash-service';
import utils from './utils/utils';

const Background = {
  responseParser(result) {
    const { urls } = result;

    if (!urls) {
      throw new Error(result);
    }

    const { regular } = urls;

    return regular;
  },

  async getBackground(query) {
    let backgroundImageUrl;

    try {
      const response = await getBackgroundData(query);

      backgroundImageUrl = this.responseParser(response);
    } catch (err) {
      errorHandler.handle(err.message);
    }

    return backgroundImageUrl;
  },

  setBackground(backgroundImageUrl) {
    // https://images.unsplash.com/photo-1477231452328-fcb5bce4a1f1?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjk4MDk5fQ
    document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0,0,0, 0.3) 100%) center center / cover fixed, url(${backgroundImageUrl}) center center / cover no-repeat fixed`;
  },

  loadBackground(backgroundImageUrl) {
    const imgElement = new Image();

    imgElement.src = backgroundImageUrl;

    const promise = new Promise((resolve) => {
      imgElement.onload = () => {
        this.setBackground(backgroundImageUrl);
        imgElement.remove();
        resolve();
      };
    });

    return promise;
  },
};

const getBackgroundSearchQuery = ({ dateTime, latitude }) => {
  const { date } = dateTime;
  const dayTime = utils.getDayTime(date, (isDayTime) => {
    const dayTimeString = isDayTime ? 'day' : 'evening';

    return dayTimeString;
  });
  const seasonOfYear = utils.getSeasonOfYear(date, latitude);

  return `${seasonOfYear} ${dayTime} nature`;
};

const changeBackground = async (query) => {
  // Quote: "данные о параметрах запроса фонового изображения для удобства
  //          в ходе проверки ментором или в процессе кросс чека выведите в консоль +10"
  console.log('Search image tags: ', query);

  try {
    if (!navigator.onLine) {
      throw new Error(errorHandler.ERROR_STATUSES.NO_CONNECTION);
    }

    let backgroundImageUrl = await Background.getBackground(query);

    if (!backgroundImageUrl) {
      // No image? Set default image
      backgroundImageUrl = 'https://images.unsplash.com/photo-1477231452328-fcb5bce4a1f1?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjk4MDk5fQ';
    }

    await Background.loadBackground(backgroundImageUrl);
  } catch (err) {
    errorHandler.handle(err.message);
  }
};

export default {
  changeBackground,
  getBackgroundSearchQuery,
};
