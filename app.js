const searchInput = document.querySelector('#recherche');
const loader = document.querySelector('.loader');
// const searchForm = document.querySelector('form');

let endOfArray = [];
let pokeList = [];

const SEARCH_RESULT_NUMBER = 130;
const POKE_CARD_ON_SCROLL = 6;
const POKE_TOTAL = 151;
let INDEX = 20;

const types = {
  grass: '#78c850',
  ground: '#E2BF65',
  dragon: '#6F35FC',
  fire: '#F58271',
  electric: '#F7D02C',
  fairy: '#D685AD',
  poison: '#966DA3',
  bug: '#B3F594',
  water: '#6390F0',
  normal: '#D9D5D8',
  psychic: '#F95587',
  flying: '#A98FF3',
  fighting: '#C25956',
  rock: '#B6A136',
  ghost: '#735797',
  ice: '#96D9D6'
};

// fetching all data needed from the API
const fetchPokemon = () => {
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKE_TOTAL}`)
    .then(response => response.json())
    .then(pokemons => {
      pokemons.results.forEach(pokemon => {
        fetchPokemonFull(pokemon);
      });
    })
}

// Adding some parameters to the API call
const fetchPokemonFull = (pokemon) => {
  let objPokemonFull = {};
  let url = pokemon.url;
  let name = pokemon.name;

  fetch(url)
    .then(response => response.json())
    .then(pokemonData => {
      objPokemonFull.pic = pokemonData.sprites.front_default
      objPokemonFull.type = pokemonData.types[0].type.name
      objPokemonFull.id = pokemonData.id

      fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
        .then(response => response.json())
        .then(pokemonData => {
          objPokemonFull.name = pokemonData.names[4].name
          pokeList.push(objPokemonFull);

          if (pokeList.length === POKE_TOTAL) {
            endOfArray = pokeList.sort(function (a, b) {
              return a.id - b.id;
            }).slice(0, INDEX);

            createPokeCard(endOfArray);
            loader.style.display = 'none';
          }
        })
    })
}

// Creating light and dark conversion colors
function lightenDarkenColor(col, amt) {

  let usePound = false;

  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }

  let num = parseInt(col,16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if  (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if  (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

// Converter RGB to HEX function
function rgbToHex(col)
{
  if(col.charAt(0) === 'r')
  {
    col = col.replace('rgb(','').replace(')','').split(',');
    let r = parseInt(col[0], 10).toString(16);
    let g = parseInt(col[1], 10).toString(16);
    let b = parseInt(col[2], 10).toString(16);
    r = r.length === 1 ? '0' + r : r;
    g = g.length === 1 ? '0' + g : g;
    b = b.length === 1 ? '0' + b : b;
    return '#' + r + g + b;
  }
}

// Creating the cards
const createPokeCard = (array) => {
  for (let i = 0; i < array.length; i++) {
    const card = document.createElement('li');
    const color = types[array[i].type];
    const cardText = document.createElement('h5');
    const cardId = document.createElement('p');
    const cardImg = document.createElement('img');

    card.style.backgroundColor = color;
    cardText.innerHTML = array[i].name;
    cardId.innerHTML = `#${array[i].id}`;
    cardImg.src = array[i].pic;

    const cardLightColor = rgbToHex(card.style.backgroundColor);

    cardId.style.color = lightenDarkenColor(cardLightColor, -70);
    cardText.style.color = lightenDarkenColor(cardLightColor, -70);
    cardId.style.color = lightenDarkenColor(cardLightColor, -70);

    card.appendChild(cardText);
    card.appendChild(cardId);
    card.appendChild(cardImg);

    document.querySelector('.liste-poke').appendChild(card);
  }
}

// Function allowing to show the list of pokemons on scroll
window.addEventListener('scroll', function () {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight) {
    addPokeCard(POKE_CARD_ON_SCROLL);
  }
});

// Function allowing to add pokemons
const addPokeCard = (nb) => {
  if (INDEX > POKE_TOTAL) {
    return;
  }

  const arrayToAdd = pokeList.slice(INDEX, INDEX + nb);
  createPokeCard(arrayToAdd);
  INDEX += nb;
}

// Search function
const searchPoke = () => {
  if (INDEX < POKE_TOTAL) {
    addPokeCard(SEARCH_RESULT_NUMBER);
  }

  let filter, listElements, titleValue, allTitles;

  filter = searchInput.value.toUpperCase();
  listElements = document.querySelectorAll('li');
  allTitles = document.querySelectorAll('li > h5');

  for (let i = 0; i < listElements.length; i++) {
    titleValue = allTitles[i].innerHTML;
    if (titleValue.toUpperCase().indexOf(filter) > -1) {
      listElements[i].style.display = 'flex';
    } else {
      listElements[i].style.display = 'none';
    }
  }
}

// Event listeners to handle the search label animation
searchInput.addEventListener('input', function (e) {
  if (e.target.value !== '') {
    e.target.parentElement.classList.add('active-input');
  } else if (e.target.value === '') {
    e.target.parentElement.classList.remove('active-input');
  }
})

/*
// Uncomment if you want to use the search function by writing in the input
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  searchPoke();
})
*/

// Comment if you want to use the search function by writing in the input
searchInput.addEventListener('keyup', searchPoke);
fetchPokemon();
