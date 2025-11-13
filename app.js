const API_KEY = 'ce517eeedff879623b5c56a600dac81e';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';
const IMG_URL_W500 = 'https://image.tmdb.org/t/p/w500';
let currentItem = null;

// Fetch Trending
async function fetchTrending(type) {
  try {
    const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
    if (!res.ok) throw new Error(`TMDB API returned ${res.status}`);
    const data = await res.json();
    return data.results.map(item => ({ ...item, media_type: type }));
  } catch (e) {
    console.error(`Error fetching ${type}:`, e);
    return [];
  }
}

async function fetchTrendingAnime() {
  let allResults = [];
  try {
    for (let page = 1; page <= 3; page++) {
      const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
      if (!res.ok) throw new Error(`TMDB error ${res.status}`);
      const data = await res.json();
      const filtered = data.results.filter(item => item.original_language === 'ja' && item.genre_ids.includes(16));
      allResults = allResults.concat(filtered.map(item => ({ ...item, media_type: 'tv' })));
    }
  } catch (e) {
    console.error("Anime fetch error:", e);
  }
  return allResults;
}

// Render
function displayBanner(item) {
  if (!item) return;
  currentItem = item;
  document.getElementById('hero-bg').src = item.backdrop_path ? `${IMG_URL_ORIGINAL}${item.backdrop_path}` : '';
  document.getElementById('hero-title').textContent = item.title || item.name;
  document.getElementById('hero-desc').textContent = item.overview;
  document.getElementById('hero-play-btn').onclick = () => showDetails(item);
}

function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    if (!item.poster_path) return;
    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || 'N/A').substring(0, 4);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const card = document.createElement('div');
    card.className = 'movie-card flex-none w-[160px] md:w-[200px] cursor-pointer relative group rounded-lg overflow-hidden bg-brand-gray';
    card.onclick = () => showDetails(item);
    card.innerHTML = `
      <img src="${IMG_URL_W500}${item.poster_path}" alt="${title}" class="w-full h-[240px] md:h-[300px] object-cover rounded-lg" 
      onerror="this.src='https://placehold.co/500x750/18191f/9ca3af?text=No+Poster'">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity