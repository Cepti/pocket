class Unit {
    constructor() {

        this.namesPile = ['Pryhovbik',
        'Krovosis',
        'Tverdonis',
        'Drovohid',
        'Medozher',
        'Pravdolam',
        'Dobrodiy',
        'Mykola',
        'Taras',
        'Antin',
        'Kvitoslava',
        'Miroslava',
        'Rostislava',
        'Yaroslava'];
        this.icon = `&#${this.attrRadnomizer(128526, 128545)};`;
        this.name = this.namesPile[`${this.attrRadnomizer(0, 13)}`];
        this.attack = this.attrRadnomizer(4, 8);
        this.armor = this.attrRadnomizer(1, 3);
        this.healthPoints = this.attrRadnomizer(8, 16);
        this.initialHp = this.healthPoints;

    }

    attrRadnomizer(min, max) { // ramdomize char attributes

        return Math.floor(Math.random() * (max - min + 1)) + min;

    }

    takeDamage(dmg) { // calculate HP left after a fight round
        
        this.healthPoints -= dmg;
        if (this.healthPoints < 0) {
            this.healthPoints = 0;
        }

    }
}

class Display {
    constructor() {

        this.startButton = document.querySelector('.start');
        this.fightButton = document.querySelector('.fight');
        this.charactersList = document.querySelector('.characters-list');
        this.battleField = document.querySelector('.battle-field');

    }

    displayUnitsList(allCharacters, charCount) {

        this.startButton.classList.add('hidden');
        alert('Choose your fighter!');
        for (let i = 0; i < charCount; i++) { // create and display containers for new chars
            const newDiv = document.createElement('div');
            newDiv.innerHTML = `<span class="char_icon">${allCharacters[i].icon}</span><br />
                                <span class="char_name">${allCharacters[i].name}</span><br />
                                Attack = ${allCharacters[i].attack}<br />
                                Armor = ${allCharacters[i].armor}<br />
                                HP = <span class="char_hp">${allCharacters[i].healthPoints}</span>`;
            this.charactersList.appendChild(newDiv);
            newDiv.dataset.index = allCharacters[i].id;
            newDiv.classList.add('char_container')
        }

    }

    displayBattleField(playerDmgInflict, compDmgInflict) { 
        
        const playerDamageDiv = document.createElement('div'); // display amount of hp that will be deducted
        playerDamageDiv.classList.add('player_damage')
        playerDamageDiv.innerText = `-${compDmgInflict}`;
        this.playerCharContainer.appendChild(playerDamageDiv);

        const compDamageDiv = document.createElement('div'); 
        compDamageDiv.classList.add('comp_damage')
        compDamageDiv.innerText = `-${playerDmgInflict}`;
        this.compCharContainer.appendChild(compDamageDiv);

        this.battleField.appendChild(this.playerCharContainer); // display battlefield with only two chosen chars
        this.battleField.appendChild(this.compCharContainer);
        this.charactersList.innerHTML = '';
        this.fightButton.classList.remove('hidden');

    }

    charsHpRerender(player, computer) { // actualize displayed chars' HP after a battle round

        const playerHp = this.playerCharContainer.querySelector('.char_hp');
        const compHp = this.compCharContainer.querySelector('.char_hp');
        
        const playerDamageDiv = document.querySelector('.player_damage');
        const compDamageDiv = document.querySelector('.comp_damage');

        playerHp.innerText = player.healthPoints;
        compHp.innerText = computer.healthPoints;

        if (player.healthPoints === 0) { // deploy visual gameplay effects
            this.playerCharContainer.classList.add('dead');
            this.compCharContainer.classList.add('winner');
            playerHp.classList.add('no_hp');
            playerDamageDiv.innerHTML = '&#10015;';
            compDamageDiv.innerHTML = '&#128077;';
        } else if (player.initialHp > player.healthPoints) {
            playerHp.classList.add('med_hp');
        }
        if (computer.healthPoints === 0) {
            this.compCharContainer.classList.add('dead');
            this.playerCharContainer.classList.add('winner');
            compHp.classList.add('no_hp');
            compDamageDiv.innerHTML = '&#10015;';
            playerDamageDiv.innerHTML = '&#128077;';
        } else if (computer.initialHp > computer.healthPoints) {
            compHp.classList.add('med_hp');
        }

    }

    cleanDisplay() { // put display into initial state

        this.startButton.classList.remove('hidden');
        this.fightButton.classList.add('hidden');
        this.battleField.innerHTML = '';

    }
}

class Game {
    constructor() {

        this.gameDisplay = new Display();

    }

    gameInit() {

        this.gameDisplay.startButton.addEventListener('click', () => {
            this.gameStart();   
        }, {once: true});

    }

    gameStart() {

        const charCount = 4;
        this.allCharacters = [];
        for (let i = 0; i < charCount; i++) { // create 4 new chars and put them into an array
            this.allCharacters[i] = new Unit();
            this.allCharacters[i].id = i;
        }
        const allCharacters = this.allCharacters;
        this.gameDisplay.displayUnitsList(allCharacters, charCount);

        const charPickEventHandler = (event) => {

            const playerCharContainer = event.target.closest('.char_container'); // pick clicked char's container div

            if (playerCharContainer) {
                this.gameDisplay.charactersList.removeEventListener('click', charPickEventHandler);
                const playerCharId = parseInt(playerCharContainer.dataset.index); // discover char id
                const playerChar = allCharacters.find((element) => element.id === playerCharId); // take the chosen char object from the array

                const leftCharacters = allCharacters.filter((elem) => elem.id !== playerCharId); // get an array without the chosen char to let computer pick his char
                const compCharIndex = Math.floor(Math.random() * leftCharacters.length); // randomize index to chose computer char
                const compChar = leftCharacters[compCharIndex]; // chose computer char
                const compCharId = compChar.id;
                const compCharContainer = document.querySelector(`[data-index="${compCharId}"`); // pick computer char's container div

                this.gameDisplay.playerCharContainer = playerCharContainer; // add both player and comp char's containers as properties of Display() instance
                this.gameDisplay.compCharContainer = compCharContainer;

                playerChar.DmgInflict = playerChar.attack - compChar.armor; // add each other dmg inflict as properties of char objects
                compChar.DmgInflict = compChar.attack - playerChar.armor;

                this.gameDisplay.displayBattleField(playerChar.DmgInflict, compChar.DmgInflict); // render battle field

                this.fightProcess(playerChar, compChar); // move to fight stage
            }
        }

        this.gameDisplay.charactersList.addEventListener('click', charPickEventHandler);

    }

    fightProcess(player, computer) {
        
        let damageResolve = () => { // calculate chars' HP left after a fight round
            player.takeDamage(computer.DmgInflict);
            computer.takeDamage(player.DmgInflict);
            this.gameDisplay.charsHpRerender(player, computer); // rerender chars' HP on battle field
            
            let gameResult; // move to the game end if someone's or both hp became 0
            if (player.healthPoints <= 0 && computer.healthPoints <= 0) {
                gameResult = `The match is over. It's a draw.`;
                this.gameOver(gameResult);
                this.gameDisplay.fightButton.removeEventListener('click', damageResolve);
            } else if (player.healthPoints <= 0) {
                gameResult = `The match is over. You have lost.`;
                this.gameOver(gameResult);
                this.gameDisplay.fightButton.removeEventListener('click', damageResolve);
            } else if (computer.healthPoints <= 0) {
                gameResult = `Congratulations! You have won the match`;
                this.gameOver(gameResult);
                this.gameDisplay.fightButton.removeEventListener('click', damageResolve);
            }
        }

        this.gameDisplay.fightButton.addEventListener('click', damageResolve);

    }

    gameOver(result) { // display end game message and move to start screen

        alert(result);
        this.gameDisplay.cleanDisplay();
        newGame = new Game();
        newGame.gameInit();

    }
}

let newGame = new Game();
newGame.gameInit();