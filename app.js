const languageData = {
    Krio: [
        { word: "kushɛ", translation: "hello", meaning: "A greeting used to say hello." },
        { word: "padi", translation: "friend", meaning: "A person you know and trust." },
        { word: "tɛnki", translation: "thank you", meaning: "An expression of gratitude." }
    ],
    Limba: [
        { word: "hallo", translation: "hello", meaning: "A greeting used to say hello." },
        { word: "mami", translation: "friend", meaning: "A person you know and trust." },
        { word: "mala", translation: "thank you", meaning: "An expression of gratitude." }
    ],
    Temne: [
        { word: "nanu", translation: "hello", meaning: "A greeting used to say hello." },
        { word: "dimo", translation: "friend", meaning: "A person you know and trust." },
        { word: "kuru", translation: "thank you", meaning: "An expression of gratitude." }
    ]
};

const searchInput = document.querySelector("#language-search");
const languageSelect = document.querySelector("#language-select");
const resultsContainer = document.querySelector("#language-results");
const languageCodes = {
    Krio: "en-US",
    Limba: "lm",
    Temne: "to"
};

function renderLanguages() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedLanguage = languageSelect.value;
    const entries = selectedLanguage === "all"
        ? Object.entries(languageData).flatMap(([language, values]) => values.map((entry) => ({ ...entry, language })))
        : languageData[selectedLanguage].map((entry) => ({ ...entry, language: selectedLanguage }));

    const matchedEntries = query
        ? entries.filter((entry) => [entry.word, entry.translation, entry.meaning].join(" ").toLowerCase().includes(query))
        : entries;

    if (!matchedEntries.length) {
        resultsContainer.innerHTML = '<p class="empty-results">No matching sample words were found.</p>';
        return;
    }

    resultsContainer.innerHTML = matchedEntries.map((entry) => `
        <article class="result-card">
            <div>
                <span>${entry.language}</span>
                <h3>${entry.word}</h3>
            </div>
            <p><strong>English meaning:</strong> ${entry.translation}</p>
            <p>${entry.meaning}</p>
            <button class="listen-button" type="button" data-word="${entry.word}" data-language="${entry.language}" aria-label="Listen to ${entry.word}">Listen</button>
        </article>
    `).join("");

    resultsContainer.querySelectorAll(".listen-button").forEach((button) => {
        button.addEventListener("click", () => playPronunciation(button.dataset.word, button.dataset.language));
    });
}

function playPronunciation(word, language) {
    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();
    const pronunciation = new SpeechSynthesisUtterance(word);
    pronunciation.lang = languageCodes[language] || "en-US";
    pronunciation.rate = 0.85;
    pronunciation.pitch = 1;
    window.speechSynthesis.speak(pronunciation);
}

searchInput.addEventListener("input", renderLanguages);
languageSelect.addEventListener("change", renderLanguages);
renderLanguages();
