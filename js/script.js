const input = document.querySelector(".search__input");
const form = document.querySelector(".search");
const gifs = document.querySelector(".gifs");
const nothing = document.querySelector('.nothing')

const apiKey = "cmWpUoCuS4CxW0UaAtXlWDnuULP8sEIj";
let offset = 0;

const getGif = async ( value, offset ) => {
    try {
        const response = await axios.get(`http://api.giphy.com/v1/gifs/search`, {
            params: {
                api_key: apiKey,
                q: value,
                limit: 15,
                offset: offset + 0
            }
        });
        const allGifs = await response.data;
        gifsHTML(allGifs.data)
        empty(allGifs.data);
        console.log(allGifs.data);
    } catch (err) {
        console.warn(err, "err");
    }
}

const gifsHTML = (gifsData) => {

    gifsData.forEach((gif) => {
        const gifTile = document.createElement('div');
        gifTile.classList.add('gifs__gif')
        const img = document.createElement('img');
        img.src = gif.images.downsized.url;
        img.alt = gif.title;
        gifTile.appendChild(img);
        gifs.appendChild(gifTile);
    });
}
const empty = (dataEmpty) => {
    if(dataEmpty.length === 0 && offset === 0) {
        nothing.classList.remove('show')
    } else {
        nothing.classList.add('show')
    }
}

const handleScroll = async () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) { 
        offset += 15;

        getGif(input.value, offset);
    }
}

window.addEventListener('scroll', handleScroll);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const inp = input.value;
    if (!input.value || input.value.trim() === '') return;
    gifs.innerHTML = ''; 
    offset = 0;
    getGif(inp, offset);

});

