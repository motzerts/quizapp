document.addEventListener('DOMContentLoaded', () => {
    const quizHistoryList = document.getElementById('quiz-history-list');
    const vocabHistoryList = document.getElementById('vocabulary-history-list');

    function loadHistory(key, listElement) {
        let history = [];
        const noDataMessage = "No history found. Play a game to see your progress! / No se encontró historial. ¡Juega un juego para ver tu progreso!";

        try {
            const storedHistory = localStorage.getItem(key);
            if (storedHistory) {
                history = JSON.parse(storedHistory);
                 // Ensure it's an array
                if (!Array.isArray(history)) {
                    history = [];
                }
            }
        } catch (e) {
            console.error("Error parsing stored history for", key, e);
            history = []; // Reset history if parsing fails
        }

        // Clear the loading message
        listElement.innerHTML = '';

        if (history.length === 0) {
            const li = document.createElement('li');
            li.textContent = noDataMessage;
            li.classList.add('no-data');
            listElement.appendChild(li);
            return;
        }

        // Display history, newest first
        history.reverse().forEach(item => {
            const li = document.createElement('li');

            // Format timestamp for readability
            let formattedDate = 'Unknown date';
            try {
                const date = new Date(item.timestamp);
                // Example format: 07 Apr 2025, 22:30
                formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
            } catch(e) {
                 console.error("Error formatting date", item.timestamp, e);
            }

            li.innerHTML = `
                Score / Puntuación: <strong>${item.score} / ${item.total}</strong>
                <span>${formattedDate}</span>
            `;
            listElement.appendChild(li);
        });
    }

    // Load histories for both game types
    loadHistory('quiz_history', quizHistoryList);
    loadHistory('vocabulary_history', vocabHistoryList);
});