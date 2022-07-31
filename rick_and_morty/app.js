// adding a new character

function addNewCharacter(obj) {
    const charImage = obj.image;
    const charWrap = document.querySelector('#characters-wrap');

    const charContainer = document.createElement('div');
    charContainer.classList.add('character-container');

    const template = `<img src="${charImage}"><button class="remove-btn" value="${obj.date}">&#10006;</button>`;
    charContainer.innerHTML = template;

    charWrap.insertBefore(charContainer, charWrap.firstChild); // place new character to top
}

// adding a stored character

function addStoredCharacter(obj) {
    const charImage = obj.image;
    const charWrap = document.querySelector('#characters-wrap');

    const charContainer = document.createElement('div');
    charContainer.classList.add('character-container');

    const template = `<img src="${charImage}"><button class="remove-btn" value="${obj.date}">&#10006;</button>`;
    charContainer.innerHTML = template;

    charWrap.appendChild(charContainer); // place stored character to bottom
}

// new character search process

function searchCharacter() {
    const searchPhrase = document.querySelector('#search-input').value;

    if (searchPhrase.match(/\D/g) || searchPhrase === '') { // validate input for being not empty and a number
        try {
            throw new Error('Enter a valid character identificator');
        } catch(error) {
            alert(error.message);
        }
    } else {
        let responseResult = fetch(`https://rickandmortyapi.com/api/character/${searchPhrase}`, {
            method: 'GET'
            })
            .then((response) => {
                if (!response.ok) {
                    const err = new Error('Character not found');
                    err.response = response;
                    throw err;
                } else {
                    return response.json();
                }
            })
            .catch(function(err) {
                alert(err.message);
            })
        return responseResult;
    }
}

const root = document.getElementById('root');

const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.disabled = true;

// displaying stored characters: default and on clicking 'load more' button

const storedChars = []; // get previously stored searchs into array 
for (let i = 0; i <= localStorage.length - 1; i++) { 
    let storedCharId = localStorage.key(i);
    storedChars[i] = JSON.parse(localStorage.getItem(storedCharId));
}
storedChars.sort(function (a, b) { // sort the array by date
    const goDown = -1;
    const goUp = 1;
    if (a.date > b.date) {
      return goDown;
    }
    if (a.date < b.date) {
      return goUp;
    }
    return 0;
});

if (storedChars.length > 0) { // initiate stored items display id storage is no empty
    const maxCharBunch = 5;
    if (storedChars.length <= maxCharBunch) { // display first 1 to 5 elements
        for (let i = 0; i <= storedChars.length - 1; i++) {
            addStoredCharacter(storedChars[i]);
        }
    } else {
        for (let i = 0; i <= maxCharBunch - 1; i++) {
            addStoredCharacter(storedChars[i]);
        }
        loadMoreButton.disabled = false; // activate "Load more" button
        loadMoreButton.addEventListener('click', function () {
            const lastDisplayed = document.querySelector('#characters-wrap').lastChild; // get last displayed picture container for an instance
            let lastDisplayedIndex;
            if (lastDisplayed.tagName === 'DIV') {
                const lastDisplayedData = lastDisplayed.querySelector('.remove-btn').value; // get it's button Data value
                lastDisplayedIndex = storedChars.findIndex((elem) => { // get it's index in storedChars array
                    let lastDisplayedElem;
                    if (elem.date === lastDisplayedData) {
                        lastDisplayedElem = elem;
                    }
                    return lastDisplayedElem;
                });
            } else {
                const magicNumberDecrementor = -1;
                lastDisplayedIndex = magicNumberDecrementor;
            }
            for (let i = lastDisplayedIndex + 1; i <= lastDisplayedIndex + maxCharBunch; i++) { // display next 5 elements after the last displayed
                addStoredCharacter(storedChars[i]);
                if (i >= storedChars.length - 1) { // break if all stored elements are already displayed
                    loadMoreButton.disabled = true;
                    break;
                }
            }
            window.scrollTo({left: 0, top: document.body.scrollHeight, behavior: 'smooth'});
        });
    }
}

// searching and displaying new characters

const searchButton = document.querySelector('#search-btn');

searchButton.addEventListener('click', async function () {
    const newChar = await searchCharacter();
    if (newChar) {
        const ifExist = storedChars.filter(storedChar => storedChar.id === `${newChar.id}`); // check if an item with this id is already exist
        if (ifExist.length === 0) {
            const addDate = Date.now();
            storedChars.unshift({'date':`${addDate}`, 'id':`${newChar.id}`, 'image':newChar.image}); // add to storedChars array
            localStorage.setItem(addDate, JSON.stringify(storedChars[0])); // add to local storage
            addNewCharacter(newChar); // add to DOM
        } else {
            alert(`Character with id=${newChar.id} is already in the list`);
        }
    }
});

// removing characters

document.addEventListener('click', function(event) {
    const removeButton = event.target.closest('.remove-btn');
    if (removeButton) {
        let isRemoved = confirm('Are you sure you want to remove this marvelous character?')
        if (isRemoved === true) {
            const removeCharDate = removeButton.value;
            const removeCharIndex = storedChars.findIndex((elem) => {
                let removeElement;
                if (elem.date === removeCharDate) {
                    removeElement = elem;
                }
                return removeElement;
            });
            storedChars.splice(removeCharIndex, 1); // remove from storedChars array
            localStorage.removeItem(removeButton.value); // remove from local storage
            removeButton.parentElement.remove(); // remove from DOM
        }
    }
});