import axios from 'axios';

const API_KEY = '29708552-e7d4371a8e552dacc71e35320';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(searchRequest, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${searchRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response;
}
