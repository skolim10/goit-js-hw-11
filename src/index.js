import { Notify } from 'notiflix';
import simpleLightbox from 'simplelightbox';
import { fetchImages } from './api';

const searchForm = document.querySelector('#search-form');
// const searchButton = document.querySelector('button[type=submit]');
const loadMoreButtton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreButtton.addEventListener('click', onLoadMoreButton);

let searchRequest = '';
let page = 1;
let perPage = 39;
let simpleLB;

function onSearchFormSubmit(e) {
  e.preventDefault();
  page = 1;
  searchRequest = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreButtton.classList.add('is-hidden');
  if (!searchRequest) return;

  fetchImages(searchRequest, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
      } else {
        createMarkup(data.hits);
        simpleLB = new simpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionPosition: 'bottom',
          captionDelay: 250,
          enableKeyboard: true,
        }).refresh();
        alertImagesFound(data);

        if (data.totalHits > perPage) {
          loadMoreButtton.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMoreButton() {
  page += 1;
  simpleLB.destroy();

  fetchImages(searchRequest, page, perPage)
    .then(({ data }) => {
      createMarkup(data.hits);
      simpleLB = new simpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page === totalPages) {
        loadMoreButtton.classList.add('is-hidden');
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function alertImagesFound(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoImagesFound() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
}

function createMarkup(images) {
  const markup = images
    .map(image => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
