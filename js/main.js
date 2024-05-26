const input = document.querySelector(".search__input");
const form = document.querySelector(".search");
const gifs = document.querySelector(".gifs");
const nothing = document.querySelector(".nothing");
const loader = document.querySelector(".loader");
const loaderTwo = document.querySelector(".loader-two");

const apiKey = "2Md5eJxVOJ8OSv5usKa02rdgZmTWzxlL";
let offset = 0;
let isLoading = false;
const time = 30 * 60 * 1000;

const getGif = async (value, offset) => {
  const cacheKey = `${value}_${offset}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(`${cacheKey}_time`);

  // Проверяем, есть ли кэшированные данные и не истекло ли время их жизни
  if (cachedData && cachedTime && Date.now() - cachedTime < time) {
    const allGifs = JSON.parse(cachedData);
    gifsHTML(allGifs.data);
    empty(allGifs.data);
    console.log("Using cached data:", allGifs.data);
    return;
  }

  try {
    const response = await axios.get("https://api.giphy.com/v1/gifs/search", {
      params: {
        api_key: apiKey,
        q: value,
        limit: 15,
        offset: offset,
      },
    });
    const allGifs = await response.data;
    gifsHTML(allGifs.data);
    empty(allGifs.data);
    console.log(allGifs.data);

    // Сохраняем данные и время их кэширования
    localStorage.setItem(cacheKey, JSON.stringify(allGifs));
    localStorage.setItem(`${cacheKey}_time`, Date.now());
  } catch (err) {
    console.warn(err, "err");
  }
};

const gifsHTML = (gifsData) => {
  gifsData.forEach((gif) => {
    const gifTile = document.createElement("div");
    gifTile.classList.add("gifs__gif");
    gifTile.classList.add("gifs__skeleton");
    const img = document.createElement("img");
    img.src = gif.images.downsized.url;
    img.alt = gif.title;
    img.onload = () => gifTile.classList.remove("gifs__skeleton");
    gifTile.appendChild(img);
    gifs.appendChild(gifTile);
  });
};

const empty = (dataEmpty) => {
  if (dataEmpty.length === 0 && offset === 0) {
    nothing.classList.remove("show");
  } else {
    nothing.classList.add("show");
  }
};

window.addEventListener("scroll", () => {
  if (isLoading) return;

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loaderTwo.classList.remove("show");
    isLoading = true;
    offset += 15;

    getGif(input.value, offset).then(() => {
      isLoading = false;
      loaderTwo.classList.add("show");
    });
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inp = input.value;
  if (!input.value || input.value.trim() === "") return;
  loader.classList.remove("show");
  loaderTwo.classList.add("show");
  nothing.classList.add("show");
  gifs.innerHTML = "";
  offset = 0;
  getGif(inp, offset).then(() => {
    loader.classList.add("show");
  });
});
