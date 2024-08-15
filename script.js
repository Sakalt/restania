document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const searchOption = document.getElementById('searchOption');
    const searchButton = document.getElementById('searchButton');
    const wordCards = document.getElementById('wordCards');

    // Fetch dictionary data function
    const fetchDictionaryData = async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching dictionary data:', error);
        }
    };

    // Create word card function
    const createWordCard = (word) => {
        return `
            <div class="card">
                <h2>${word["日本語訳"]}</h2>
                <p><strong>架空言語訳:</strong> ${word["架空言語訳"]}</p>
                <p><strong>関連語:</strong> ${word["関連語"].join(", ")}</p>
                <p><strong>発音:</strong> ${word["発音"]}</p>
                <p><strong>説明:</strong> ${word["説明"]}</p>
                <p><strong>古語:</strong> ${word["古語"]}</p>
            </div>
        `;
    };

    // Display initial word cards function
    const displayInitialCards = async () => {
        const data = await fetchDictionaryData();
        if (!data || !data["レスタニア語"] || !data["レスタニア語"]["基本的な会話"]) {
            console.error('レスタニア語の「基本的な会話」カテゴリが見つかりませんでした。');
            wordCards.innerHTML = "<p>データが見つかりませんでした。</p>";
            return;
        }

        wordCards.innerHTML = data["レスタニア語"]["基本的な会話"].map(createWordCard).join("");
    };

    // Display search results function
    const displayResults = async () => {
        const data = await fetchDictionaryData();
        if (!data || !data["レスタニア語"]) {
            console.error('レスタニア語のデータが見つかりませんでした。');
            wordCards.innerHTML = "<p>データが見つかりませんでした。</p>";
            return;
        }

        const searchValue = searchInput.value.toLowerCase();
        const searchTypeValue = searchType.value;
        const searchOptionValue = searchOption.value;

        if (!data["レスタニア語"][searchOptionValue]) {
            console.error(`カテゴリ '${searchOptionValue}' が見つかりませんでした。`);
            wordCards.innerHTML = "<p>データが見つかりませんでした。</p>";
            return;
        }

        const results = [];
        data["レスタニア語"][searchOptionValue].forEach(word => {
            const searchField = searchOptionValue === "基本的な会話" ? word["日本語訳"].toLowerCase() : word["架空言語訳"].toLowerCase();
            if (
                (searchTypeValue === "partial" && searchField.includes(searchValue)) ||
                (searchTypeValue === "exact" && searchField === searchValue) ||
                (searchTypeValue === "prefix" && searchField.startsWith(searchValue))
            ) {
                results.push(word);
            }
        });

        wordCards.innerHTML = results.length > 0 ? results.map(createWordCard).join("") : "<p>該当する単語が見つかりませんでした。</p>";
    };

    // Initial display
    displayInitialCards();

    searchButton.addEventListener('click', displayResults);
});
