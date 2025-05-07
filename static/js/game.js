// static/js/game.js - CORRECTED VERSION

document.addEventListener('DOMContentLoaded', () => {
    // --- Shared Elements & Variables ---
    const optionsArea = document.getElementById('options-area');
    const feedbackArea = document.getElementById('feedback-area');
    const scoreElement = document.getElementById('score');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');

    // References to specific game area divs (to get question text / english word elements)
    const questionArea = document.getElementById('question-area'); // Used by quizzes
    const wordArea = document.getElementById('word-area'); // Used by vocabulary

    let currentItemIndex = 0;
    let score = 0;
    let gameData = []; // Will hold quiz questions or vocab words
    let gameType = ''; // 'quiz', 'vocabulary', 'history_pre_roman', 'ancient_history' etc.

    // --- Game Specific Data (MVP - Hardcoded) ---

    const quizQuestions = [ // Example: Science Quiz Questions
        { question: "What part of the plant absorbs water...? / ¿Qué parte de la planta...?", options: ["Leaf / Hoja", "Stem / Tallo", "Root / Raíz", "Flower / Flor"], correctAnswer: "Root / Raíz" },
        { question: "What gas do humans breathe out...? / ¿Qué gas exhalan...?", options: ["Oxygen / Oxígeno", "Nitrogen / Nitrógeno", "Carbon Dioxide / Dióxido de carbono", "Hydrogen / Hidrógeno"], correctAnswer: "Carbon Dioxide / Dióxido de carbono" },
        { question: "What is the center of the Solar System...? / ¿Cuál es el centro...?", options: ["Earth / Tierra", "Moon / Luna", "Sun / Sol", "Mars / Marte"], correctAnswer: "Sun / Sol" },
        { question: "Solid, Liquid, and Gas are states of...? / Sólido, Líquido y Gaseoso...?", options: ["Energy / Energía", "Matter / Materia", "Light / Luz", "Sound / Sonido"], correctAnswer: "Matter / Materia" }
    ];

    const vocabularyWords = [
        { englishWord: "Photosynthesis", options: ["Fotosíntesis", "Respiración", "Evaporación", "Condensación"], correctTranslation: "Fotosíntesis" },
        { englishWord: "Gravity", options: ["Electricidad", "Magnetismo", "Gravedad", "Fricción"], correctTranslation: "Gravedad" },
        { englishWord: "Habitat", options: ["Ecosistema", "Hábitat", "Bioma", "Nicho"], correctTranslation: "Hábitat" },
        { englishWord: "Molecule", options: ["Átomo", "Célula", "Molécula", "Elemento"], correctTranslation: "Molécula" }
    ];

    // Define placeholder if preRomanQuizQuestions are not ready yet
    // const preRomanQuizQuestions = [ /* Add questions here when ready */ ];
    const preRomanQuizQuestions = []; // Define as empty array to prevent errors if accessed

    // *** MODIFIED ancientHistoryQuestions array with English-only answers ***
    const ancientHistoryQuestions = [ // Ancient History Quiz Questions
        {
            question: "1. ¿Qué pueblo vivía en el sur y este de la Península antes de los romanos?<br>Which people lived in the south and east of the Iberian Peninsula before the Romans?",
            options: ["The Iberians", "The Celts", "The Greeks"],
            correctAnswer: "The Iberians"
        },
        {
            question: "2. ¿En qué zonas vivían los celtas?<br>In which parts did the Celts live?",
            options: ["North, centre & west", "South & east", "Balearic Islands"],
            correctAnswer: "North, centre & west"
        },
        {
            question: "3. ¿Qué lengua difundieron los romanos por Hispania?<br>Which language did the Romans spread throughout Hispania?",
            options: ["Latin", "Greek", "Celtic"],
            correctAnswer: "Latin"
        },
        {
            question: "4. Señala una lengua moderna que procede del latín.<br>Choose one modern language that comes from Latin.",
            options: ["Spanish", "English", "German"],
            correctAnswer: "Spanish"
        },
        {
            question: "5. Las ciudades romanas tenían murallas ________.<br>Roman cities had ________ walls.",
            options: ["defensive", "decorative", "transparent"],
            correctAnswer: "defensive"
        },
        {
            question: "6. Las familias ricas vivían en casas llamadas _______.<br>Rich families lived in homes called _______.",
            options: ["domus", "insulae", "villae"],
            correctAnswer: "domus"
        },
        {
            question: "7. Los baños públicos romanos se llamaban _____ (en latín).<br>Roman public baths were called _____.",
            options: ["thermae", "circus", "forum"],
            correctAnswer: "thermae"
        },
        {
            question: "8. Los romanos utilizaban los _______ para llevar agua a la ciudad.<br>The Romans used _______ to carry water to the city.",
            options: ["aqueducts", "bridges", "theatres"],
            correctAnswer: "aqueducts"
        },
        {
            question: "9. Selecciona uno de los dioses principales romanos.<br>Select one of the main Roman deities.",
            options: ["Jupiter", "Zeus", "Apollo"],
            correctAnswer: "Jupiter"
        },
        {
            question: "10. El cristianismo apareció en el siglo ___.<br>Christianity appeared in the ___ century.",
            options: ["1st", "3rd", "10th"],
            correctAnswer: "1st"
        },
        {
            question: "11. El Imperio romano terminó en el año ___.<br>The Roman Empire ended in AD ___.",
            options: ["476", "1492", "0"],
            correctAnswer: "476"
        },
        {
            question: "12. Las ciudades-estado griegas se llamaban _______.<br>Greek city-states were called _______.",
            options: ["poleis", "coloniae", "domus"],
            correctAnswer: "poleis"
        },
        {
            question: "13. El mercado griego tenía lugar en la _____.<br>The Greek market took place in the _____.",
            options: ["agora", "acropolis", "circus"],
            correctAnswer: "agora"
        },
        {
            question: "14. En Atenas se desarrolló una forma de gobierno llamada _______.<br>In Athens, a form of government called _______ developed.",
            options: ["democracy", "monarchy", "empire"],
            correctAnswer: "democracy"
        },
        {
            question: "15. Los griegos creían que sus dioses vivían en el monte _______.<br>The Greeks believed their gods lived on Mount _______.",
            options: ["Olympus", "Etna", "Everest"],
            correctAnswer: "Olympus"
        }
    ];
    // *** REMOVED DUPLICATE ANCIENT HISTORY DATA BLOCK THAT WAS HERE ***

    // --- Determine Game Type & Initialize ---

    // Get references to the *container* elements for each game type
    const quizContainer = document.getElementById('quiz-container'); // Science quiz
    const vocabContainer = document.getElementById('vocabulary-container');
    const historyQuizContainer = document.getElementById('history-quiz-container'); // Pre-Roman quiz
    const ancientHistoryContainer = document.getElementById('ancient-history-quiz-container'); // Ancient History quiz

    // Check which container exists and initialize the corresponding game
    if (quizContainer && quizContainer.dataset.gameType === 'quiz') {
        gameType = 'quiz';
        gameData = quizQuestions;
        initializeQuiz();
    } else if (vocabContainer && vocabContainer.dataset.gameType === 'vocabulary') {
        gameType = 'vocabulary';
        gameData = vocabularyWords;
        initializeVocabulary();
    } else if (historyQuizContainer && historyQuizContainer.dataset.gameType === 'history_pre_roman') {
        gameType = 'history_pre_roman';
        gameData = preRomanQuizQuestions; // Assign the (currently empty or placeholder) array.
        if (gameData.length > 0) {
             initializeQuiz();
        } else {
             console.warn(`Pre-Roman quiz selected, but 'preRomanQuizQuestions' array is empty or not populated.`);
             if(questionArea) questionArea.innerHTML = '<p class="no-data">Pre-Roman Quiz not available yet / Quiz Pre-Romano no disponible todavía</p>';
             // Disable game buttons if no data
             if(nextBtn) nextBtn.style.display = 'none';
             if(restartBtn) restartBtn.style.display = 'none';
        }
    } else if (ancientHistoryContainer && ancientHistoryContainer.dataset.gameType === 'ancient_history') {
        gameType = 'ancient_history';
        gameData = ancientHistoryQuestions; // Assign the correct question array
        initializeQuiz();
    }
    // Add more 'else if' blocks here for any other game types


    // --- Quiz Specific Functions ---

    function initializeQuiz() { // Generic initializer for any quiz type
        currentItemIndex = 0;
        score = 0;
        if (feedbackArea) feedbackArea.textContent = ''; // Check if element exists
        if (scoreElement) scoreElement.textContent = score; // Check if element exists
        if (nextBtn) nextBtn.style.display = 'none'; // Check if element exists
        if (restartBtn) restartBtn.style.display = 'none'; // Check if element exists

        // Ensure question area is visible and ready
        if (questionArea && !document.getElementById('question-text')) {
             questionArea.innerHTML = '<h2 id="question-text">Loading question...</h2>';
        } else if (!questionArea) {
            console.error("Question area div not found for quiz initialization.");
            return; // Cannot proceed
        }
        loadQuizQuestion();
    }

    function loadQuizQuestion() { // Generic loader for any quiz type
         if (!gameData || gameData.length === 0) { // Check if gameData is populated
            console.error("gameData is empty or not defined for gameType:", gameType);
            if(questionArea) questionArea.innerHTML = '<p class="no-data">Error: Could not load questions for this quiz.</p>';
            return; // Stop if no data
        }

        if (currentItemIndex < gameData.length) {
            const currentQuestion = gameData[currentItemIndex];
            const questionTextElement = document.getElementById('question-text');

            if (!currentQuestion) {
                console.error(`Error: Could not load question data at index ${currentItemIndex}`);
                return; // Stop if data is missing for this index
            }

            if (questionTextElement) {
                 questionTextElement.innerHTML = currentQuestion.question; // Use innerHTML for <br>
            } else {
                 console.error("Element with ID 'question-text' not found!");
            }

            if (!optionsArea) { console.error("Element with ID 'options-area' not found!"); return; }
            optionsArea.innerHTML = '';

            if (feedbackArea) feedbackArea.textContent = '';
            if (nextBtn) nextBtn.style.display = 'none';

            if (currentQuestion && Array.isArray(currentQuestion.options)) {
                currentQuestion.options.forEach(option => {
                    const button = document.createElement('button');
                    button.textContent = option;
                    button.onclick = () => selectAnswer(option, currentQuestion.correctAnswer);
                    optionsArea.appendChild(button);
                });
            } else {
                console.error("Error: currentQuestion.options is missing or not an array!", currentQuestion);
            }
        } else {
            // This condition means all questions have been answered
            if (gameData.length > 0 && currentItemIndex >= gameData.length) {
                showFinalScore();
            }
        }
    }


    // --- Vocabulary Specific Functions ---

    function initializeVocabulary() {
        currentItemIndex = 0;
        score = 0;
        if(feedbackArea) feedbackArea.textContent = '';
        if(scoreElement) scoreElement.textContent = score;
        if(nextBtn) nextBtn.style.display = 'none';
        if(restartBtn) restartBtn.style.display = 'none';

         if (wordArea && !document.getElementById('english-word')) {
             wordArea.innerHTML = '<p>What is the Spanish translation for:</p><div id="english-word">Loading word...</div>';
         } else if (!wordArea) {
             console.error("Word area div not found for vocabulary initialization.");
             return; // Cannot proceed
         }
        loadVocabularyWord();
    }

    function loadVocabularyWord() {
        if (!gameData || gameData.length === 0) {
            console.error("gameData is empty or not defined for vocabulary gameType:", gameType);
             if(wordArea) wordArea.innerHTML = '<p class="no-data">Error: Could not load vocabulary words.</p>';
            return; // Stop if no data
        }

        if (currentItemIndex < gameData.length) {
            const currentWord = gameData[currentItemIndex];

            if (!currentWord) {
                 console.error(`Error: Could not load word data at index ${currentItemIndex}`);
                 return;
            }

             const englishWordElement = document.getElementById('english-word');
             if (englishWordElement) englishWordElement.textContent = currentWord.englishWord;
             else { console.error("Element 'english-word' not found!"); }

             if (!optionsArea) { console.error("Options area not found!"); return; }
             optionsArea.innerHTML = '';

             if (feedbackArea) feedbackArea.textContent = '';
             if (nextBtn) nextBtn.style.display = 'none';


             if (currentWord && Array.isArray(currentWord.options)) {
                 currentWord.options.forEach(option => {
                    const button = document.createElement('button');
                    button.textContent = option;
                    button.onclick = () => selectAnswer(option, currentWord.correctTranslation);
                    optionsArea.appendChild(button);
                });
             } else {
                 console.error("Error: currentWord.options is missing or not an array!", currentWord);
             }

        } else {
             if (gameData.length > 0 && currentItemIndex >= gameData.length) {
                 showFinalScore();
             }
        }
    }


    // --- Shared Game Logic Functions ---

    function selectAnswer(selectedOption, correctOption) {
        if (!optionsArea) { console.error("optionsArea not found in selectAnswer"); return; }
        const buttons = optionsArea.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);

        if (!feedbackArea) { console.error("feedbackArea not found in selectAnswer"); return; }
        if (selectedOption === correctOption) {
            score++;
            feedbackArea.textContent = "Correct! / ¡Correcto!";
            feedbackArea.className = 'feedback correct';
        } else {
            feedbackArea.innerHTML = `Incorrect. The answer was: ${correctOption} / Incorrecto. La respuesta era: ${correctOption}`;
            feedbackArea.className = 'feedback incorrect';
        }

        if (scoreElement) scoreElement.textContent = score;
        if (nextBtn) nextBtn.style.display = 'inline-block';
    }

    function showFinalScore() {
        const displayArea = questionArea || wordArea;
        if (displayArea) {
             const totalItems = gameData ? gameData.length : 0;
             displayArea.innerHTML = `<h2>Game Over! / ¡Fin del juego!</h2> <p>Your final score is ${score} out of ${totalItems}. / Tu puntuación final es ${score} de ${totalItems}.</p>`;
        }
         if (optionsArea) optionsArea.innerHTML = '';
         if (feedbackArea) feedbackArea.textContent = '';
         if (nextBtn) nextBtn.style.display = 'none';
         if (restartBtn) restartBtn.style.display = 'inline-block';

        if (gameData && gameData.length > 0) {
            saveGameResult(gameType, score, gameData.length);
        }
    }

    function saveGameResult(type, currentScore, totalItems) {
        const historyKey = `${type}_history`;
        let history = [];
        try {
            const storedHistory = localStorage.getItem(historyKey);
            if (storedHistory) {
                history = JSON.parse(storedHistory);
                if (!Array.isArray(history)) { history = []; }
            }
        } catch (e) { console.error("Error parsing stored history for", historyKey, e); history = []; }

        const result = { score: currentScore, total: totalItems, timestamp: new Date().toISOString() };
        history.push(result);
        try {
            localStorage.setItem(historyKey, JSON.stringify(history));
            console.log(`Saved ${type} result:`, result);
        } catch (e) { console.error("Error saving history to LocalStorage for", historyKey, e); }
    }


    function handleNext() {
        currentItemIndex++;
        // Determine game type based on the structure of the first item in gameData
        // This assumes all items in gameData for a specific game will have a consistent structure
        if (gameData && gameData[0] && gameData[0].hasOwnProperty('englishWord')) {
            loadVocabularyWord();
        } else if (gameData && gameData[0] && gameData[0].hasOwnProperty('question')) {
            loadQuizQuestion();
        } else {
            console.error("Cannot determine game type in handleNext. gameData might be empty or have unexpected structure.");
        }
    }

    function handleRestart() {
         if (gameData && gameData[0] && gameData[0].hasOwnProperty('englishWord')) {
             if (wordArea) {
                 wordArea.innerHTML = '<p>What is the Spanish translation for:</p><div id="english-word">Loading word...</div>';
             }
             initializeVocabulary();
         } else if (gameData && gameData[0] && gameData[0].hasOwnProperty('question')) {
              if (questionArea) {
                 questionArea.innerHTML = '<h2 id="question-text">Loading question...</h2>';
              }
             initializeQuiz();
         } else {
             console.error("Cannot determine game type in handleRestart. gameData might be empty or have unexpected structure.");
             // Potentially display a generic error to the user
             const displayArea = questionArea || wordArea;
             if (displayArea) {
                displayArea.innerHTML = '<p class="no-data">Error restarting game. Data missing.</p>';
             }
         }
    }


    // --- Event Listeners ---
    if (nextBtn) {
      nextBtn.addEventListener('click', handleNext);
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', handleRestart);
    }

}); // End of DOMContentLoaded listener
