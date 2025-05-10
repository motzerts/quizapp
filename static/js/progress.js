document.addEventListener('DOMContentLoaded', () => {
    const historiesContainer = document.getElementById('all-histories-container');

    // Helper to prettify game type names
    function prettifyGameType(type) {
        const map = {
            quiz: 'Quiz History / Historial de Cuestionarios',
            vocabulary: 'Vocabulary History / Historial de Vocabulario',
            ancient_history: 'Ancient History / Historia Antigua',
            medieval_history: 'Medieval History / Historia Medieval',
            history_pre_roman: 'Pre-Roman History / Historia Pre-Romana',
        };
        // Default: Capitalize and replace underscores
        return map[type] || (type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' '));
    }

    // Find all *_history keys in localStorage
    const allKeys = Object.keys(localStorage);
    const historyKeys = allKeys.filter(k => k.endsWith('_history'));

    if (historyKeys.length === 0) {
        historiesContainer.innerHTML = '<div class="no-data">No history found. Play a game to see your progress! / No se encontró historial. ¡Juega un juego para ver tu progreso!</div>';
        return;
    }

    historiesContainer.innerHTML = '';

    historyKeys.forEach(key => {
        let history = [];
        try {
            const storedHistory = localStorage.getItem(key);
            if (storedHistory) {
                history = JSON.parse(storedHistory);
                if (!Array.isArray(history)) history = [];
            }
        } catch (e) {
            console.error('Error parsing stored history for', key, e);
            history = [];
        }

        const gameType = key.replace(/_history$/, '');
        const section = document.createElement('div');
        section.className = 'progress-section';
        section.innerHTML = `<h2>${prettifyGameType(gameType)}</h2>`;
        const ul = document.createElement('ul');

        if (history.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No history found. Play a game to see your progress! / No se encontró historial. ¡Juega un juego para ver tu progreso!';
            li.classList.add('no-data');
            ul.appendChild(li);
        } else {
            history.slice().reverse().forEach(item => {
                const li = document.createElement('li');
                let formattedDate = 'Unknown date';
                try {
                    const date = new Date(item.timestamp);
                    formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
                } catch(e) {}
                li.innerHTML = `Score / Puntuación: <strong>${item.score} / ${item.total}</strong> <span>${formattedDate}</span>`;
                ul.appendChild(li);
            });
        }
        section.appendChild(ul);
        historiesContainer.appendChild(section);
    });
});