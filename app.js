document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://pokeapi.co/api/v2/type/';
    const pokemonContainer = document.getElementById('pokemonContainer');
    const typeFilter = document.getElementById('typeFilter');
    const resetButton = document.getElementById('resetButton');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    let allPokemon = [];

    // Fetch Pokémon Types and Populate Type Filter
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(type => {
                const option = document.createElement('option');
                option.value = type.url;
                option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
                typeFilter.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching types:', error);
            alert('Failed to fetch Pokémon types. Please try again later.');
        });

    // Fetch All Pokémon and Display Them
    const fetchAllPokemon = () => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
            .then(response => response.json())
            .then(data => {
                allPokemon = data.results;
                displayPokemon(allPokemon);
            })
            .catch(error => {
                console.error('Error fetching Pokémon:', error);
                alert('Failed to fetch Pokémon. Please try again later.');
            });
    };

    fetchAllPokemon();

    // Display Pokémon
    const displayPokemon = (pokemonList) => {
        pokemonContainer.innerHTML = '';
        pokemonList.forEach(pokemon => {
            fetch(pokemon.url)
                .then(response => response.json())
                .then(details => {
                    const pokemonCard = document.createElement('div');
                    pokemonCard.className = 'pokemon-card';

                    const pokemonCardInner = document.createElement('div');
                    pokemonCardInner.className = 'pokemon-card-inner';

                    const pokemonCardFront = document.createElement('div');
                    pokemonCardFront.className = 'pokemon-card-front';
                    pokemonCardFront.innerHTML = `
                        <img src="${details.sprites.front_default}" alt="${pokemon.name}">
                        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                    `;

                    const pokemonCardBack = document.createElement('div');
                    pokemonCardBack.className = 'pokemon-card-back';
                    pokemonCardBack.innerHTML = `
                        <p>Abilities: ${details.abilities.map(a => a.ability.name).join(', ')}</p>
                    `;

                    pokemonCardInner.appendChild(pokemonCardFront);
                    pokemonCardInner.appendChild(pokemonCardBack);
                    pokemonCard.appendChild(pokemonCardInner);
                    pokemonContainer.appendChild(pokemonCard);

                    // Add flip functionality
                    pokemonCard.addEventListener('click', () => {
                        pokemonCard.classList.toggle('flipped');
                    });
                })
                .catch(error => {
                    console.error('Error fetching Pokémon details:', error);
                });
        });
    };

    // Filter by Type
    typeFilter.addEventListener('change', () => {
        const typeUrl = typeFilter.value;
        if (typeUrl) {
            fetch(typeUrl)
                .then(response => response.json())
                .then(data => {
                    const filteredPokemon = data.pokemon.map(p => p.pokemon);
                    displayPokemon(filteredPokemon);
                })
                .catch(error => {
                    console.error('Error filtering Pokémon:', error);
                });
        } else {
            displayPokemon(allPokemon);
        }
    });

    // Reset Button Functionality
    resetButton.addEventListener('click', () => {
        typeFilter.value = '';
        searchBar.value = '';
        displayPokemon(allPokemon);
    });

    // Search Functionality
    const performSearch = () => {
        const query = searchBar.value.toLowerCase();
        const filteredPokemon = allPokemon.filter(pokemon =>
            pokemon.name.toLowerCase().includes(query)
        );
        if (filteredPokemon.length > 0) {
            displayPokemon(filteredPokemon);
        } else {
            pokemonContainer.innerHTML = '<p>No Pokémon found</p>';
        }
    };

    // Trigger search when the search button is clicked
    searchButton.addEventListener('click', performSearch);

    // Optional: Trigger search when pressing "Enter" in the search bar
    searchBar.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});
