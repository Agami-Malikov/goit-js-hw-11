import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { PixabayAPI } from './pixabay-api';

const refs = {
  form: document.querySelector('.search-form'),
  searchInp: document.querySelector('.search-form__input'),
  galleryList: document.querySelector('.gallery__list'),
  loadMoreBtn: document.querySelector('.gallery__btn'),
};

refs.loadMoreBtn.style.display = 'none';

const pixabayAPI = new PixabayAPI();
let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

// ------------ Search Submit -------------------

async function onSearchSubmit(event) {
  event.preventDefault();
  refs.galleryList.innerHTML = '';

  pixabayAPI.q = event.currentTarget.elements.searchQuery.value;

  try {
    const { data } = await pixabayAPI.apiParameters();
    let totalPages = Math.ceil(data.totalHits / data.hits.length);
    console.log(data.hits);

    if (pixabayAPI.q === '' || data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.loadMoreBtn.style.display = 'none';
      return;
    } else if (pixabayAPI.page === totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreBtn.style.display = 'none';
      createImgList(data.hits);
      lightbox.refresh();
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      createImgList(data.hits);
      lightbox.refresh();
      refs.loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.log(error);
  }
  pixabayAPI.loadMore();
}

refs.form.addEventListener('submit', onSearchSubmit);

// ------------Create Gallery List -------

function createImgList(hits) {
  let markup = hits
    .map(
      hit => `<li class="photo-card">
      <a class="gallery__item" href="${hit.largeImageURL}">
      <img class="photo-card__img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width=300 height=190/>
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${hit.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${hit.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${hit.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${hit.downloads}
        </p>
      </div>
      </li>`
    )
    .join('');
  return refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

// ---------------- Load More ------------

async function onLoadMoreBtnClick() {
  try {
    const { data } = await pixabayAPI.apiParameters();

    let totalPages = Math.ceil(data.totalHits / data.hits.length);

    if (totalPages === pixabayAPI.page + 1) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.style.display = 'none';
      makeMarkup(data.hits);
      lightbox.refresh();
    } else {
      createImgList(data.hits);
      lightbox.refresh();
      pixabayAPI.loadMore();
    }
  } catch (err) {
    console.log(err);
  }
}

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
