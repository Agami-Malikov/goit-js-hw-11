import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28828144-6f976b2b9f2c4eab88aac9d69';

  constructor() {
    this.q = null;
    this.page = 1;
  }

  apiParameters() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.page,
      },
    });
  }

  loadMore() {
    this.page += 1;
  }
}
