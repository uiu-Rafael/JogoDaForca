const HangmanImage = document.querySelector(".hangman-box img")
const WordDisplay = document.querySelector(".word-display")
const guessesText = document.querySelector(".guesses-text b")
const keyboardDiv = document.querySelector(".keyboard")
const gameModal = document.querySelector(".game-modal")
const playAgainBtn = document.querySelector(".play-again")

let currentWord, correctLetters, wrongGuessesCount
const maxGuesses = 6

const resetGame = () => {
    //Redefinindo todas as variáveis ​​do jogo e elementos da UI
    correctLetters = []
    wrongGuessesCount = 0
    HangmanImage.src = `images/hangman-${wrongGuessesCount}.svg`
    guessesText.innerText = `${wrongGuessesCount} / ${maxGuesses}`
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false)
    WordDisplay.innerHTML = currentWord.split("").map(() => '<li class="letter"></li>').join("")
    gameModal.classList.remove("show")
}

const getRandomWord = () => {
    // Selecionando uma palavra aleatória e uma dica da wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)]
    currentWord = word
    document.querySelector(".hint-text b").innerText = hint
    resetGame()
}   

const gameOver = (isVictory) => {
    // Após 600ms de jogo completo.. mostrando modal com detalhes relevantes
    setTimeout(() => {
        const modalText = isVictory ? 'Você achou a palavra:' : 'A palavra correta era:'
        gameModal.querySelector("img").src = `images/${isVictory ? `victory` : `lost`}.gif`
        gameModal.querySelector("h4").innerHTML = `${isVictory ? `Parábens!` : `Fim de jogo!`}`
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`
        gameModal.classList.add("show")
    }, 300)
}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const initGame = (button, clickedLetter) => {
    clickedLetter = removeAccents(clickedLetter.toLowerCase());
    const normalizedWord = removeAccents(currentWord.toLowerCase());

    if (normalizedWord.includes(clickedLetter)) {
        // Mostrar todas as letras corretas na exibição da palavra
        [...normalizedWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                WordDisplay.querySelectorAll("li")[index].innerText = currentWord[index];
                WordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // Se a letra clicada não existir, atualize a contagem de erros e a imagem do enforcado
        wrongGuessesCount++;
        HangmanImage.src = `images/hangman-${wrongGuessesCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessesCount} / ${maxGuesses}`;

    // Chame a função gameOver se alguma dessas condições for atendida
    if (wrongGuessesCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
}


// Criando botões do teclado e adicionando ouvintes de eventos
for (let i = 97; i < 122; i++) {
    const button = document.createElement("button")
    button.innerText = String.fromCharCode(i)
    keyboardDiv.appendChild(button)
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)))
}

getRandomWord()
playAgainBtn.addEventListener("click", getRandomWord)