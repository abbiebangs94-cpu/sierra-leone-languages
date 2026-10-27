const languageData = {
    Krio: [
        { word: "Salone", translation: "Sierra Leone" },
        { word: "Kushɛ/Adu", translation: "Hello / hi" },
        { word: "Padi", translation: "Friend" },
        { word: "Titi", translation: "Girl" },
        { word: "Bɔbɔ", translation: "Boy" },
        { word: "Mi", translation: "Me" },
        { word: "Pikin", translation: "Child" },
        { word: "Wɔwɔ", translation: "Ugly" },
        { word: "Yu", translation: "You" },
        { word: "Plaba", translation: "Conflict" },
        { word: "Sɔri/Ɔsh", translation: "Sorry" }, 
        { word: "Tɔk", translation: "Talk" },
        { word: "Fɔgɛt", translation: "Forget" },
        { word: "Ansa", translation: "Answer" },
        { word: "Mek", translation: "Make" },
        { word: "Bɔbu", translation: "Many / too much" },
        { word: "Uman", translation: "Woman" },
        { word: "Lef", translation: "Stop" },
        { word: "Mɔt", translation: "Mouth" },
        { word: "Kil", translation: "Kill" },
        { word: "Pipul", translation: "People" },
        { word: "Wetin", translation: "What" },
        { word: "Usay", translation: "Where" },
        { word: "Usai", translation: "Where" },
        { word: "We", translation: "Where" },
        { word: "Wetin-mek", translation: "Why" },
        { word: "Ustɛm", translation: "When" },
        { word: "Vɛx", translation: "Angry" },
        { word: "Dia", translation: "Expensive" },
        { word: "Waka", translation: "Walk" },
        { word: "Cham", translation: "Chew" },
        { word: "Motoka", translation: "Car" },
        { word: "Sabi", translation: "Know" },
        { word: "Fɛt", translation: "Fight" },
        { word: "Wɛf", translation: "Wife" },
        { word: "Lɛf", translation: "Stop" },
        { word: "Mama", translation: "Mother" },
        { word: "Papa", translation: "Father" },
        { word: "Grani", translation: "Grandmother" },
        { word: "Granpa", translation: "Grandfather" },
        { word: "Tif", translation: "Steal" },
        { word: "Jomp", translation: "Jump" },
        { word: "Chɛr", translation: "Rip" },
        { word: "Dede", translation: "Dead" },
        { word: "Dai", translation: "Dead" },
        { word: "Tata", translation: "Bye" }
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
const pronunciationVoiceSelect = document.querySelector("#pronunciation-voice");
const pronunciationStatus = document.querySelector("#pronunciation-status");
const resultsContainer = document.querySelector("#language-results");
const languageCodes = {
    Krio: "en-US",
    Limba: "lm",
    Temne: "to"
};
const africanEnglishLocales = ["en-SL", "en-GH", "en-NG", "en-LR", "en-GM", "en-ZA", "en-KE", "en-UG"];

function renderLanguages() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedLanguage = languageSelect.value;
    const entries = selectedLanguage === "all"
        ? Object.entries(languageData).flatMap(([language, values]) => values.map((entry) => ({ ...entry, language })))
        : languageData[selectedLanguage].map((entry) => ({ ...entry, language: selectedLanguage }));

    if (!query) {
        resultsContainer.innerHTML = '<p class="empty-results">Enter a word or meaning to see matching vocabulary.</p>';
        return;
    }

    const matchedEntries = entries.filter((entry) =>
        [entry.word, entry.translation, entry.meaning || ""]
            .some((text) => text.toLowerCase().includes(query))
    );

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
            ${entry.meaning ? `<p>${entry.meaning}</p>` : ""}
            <button class="listen-button" type="button" data-word="${entry.word}" data-language="${entry.language}" aria-label="Listen to ${entry.word}">Listen</button>
        </article>
    `).join("");

    resultsContainer.querySelectorAll(".listen-button").forEach((button) => {
        button.addEventListener("click", () => playPronunciation(button.dataset.word, button.dataset.language));
    });
}

function playPronunciation(word, language) {
    if (!("speechSynthesis" in window)) {
        pronunciationStatus.textContent = "Speech playback is not supported by this browser.";
        return;
    }

    const voices = window.speechSynthesis.getVoices();
    let voice;
    if (pronunciationVoiceSelect.value === "african") {
        voice = africanEnglishLocales
            .map((locale) => voices.find((candidate) => candidate.lang.toLowerCase() === locale.toLowerCase()))
            .find(Boolean);
    } else {
        const preferredLocale = languageCodes[language] || "en-US";
        voice = voices.find((candidate) => candidate.lang.toLowerCase().startsWith(preferredLocale.toLowerCase()));
    }

    window.speechSynthesis.cancel();
    const pronunciation = new SpeechSynthesisUtterance(word);
    pronunciation.lang = voice?.lang || languageCodes[language] || "en-US";
    if (voice) {
        pronunciation.voice = voice;
        pronunciationStatus.textContent = `Playing with ${voice.name} (${voice.lang}).`;
    } else if (pronunciationVoiceSelect.value === "african") {
        pronunciationStatus.textContent = "No African English voice was found. Playing with the device's default voice.";
    } else {
        pronunciationStatus.textContent = "Playing with the device's default voice.";
    }
    pronunciation.rate = 0.85;
    pronunciation.pitch = 1;
    window.speechSynthesis.speak(pronunciation);
}

pronunciationVoiceSelect.addEventListener("change", () => {
    pronunciationStatus.textContent = pronunciationVoiceSelect.value === "african"
        ? "African English is preferred when available on this device."
        : "The device's default voice will be used.";
});

searchInput.addEventListener("input", renderLanguages);
languageSelect.addEventListener("change", renderLanguages);
renderLanguages();
