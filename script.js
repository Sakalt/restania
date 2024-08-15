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
        if (!data) {
            wordCards.innerHTML = "<p>データの読み込みに失敗しました。</p>";
            return;
        }

        // Default display is "基本的な会話" category
        const defaultOption = "基本的な会話";
        if (!data[defaultOption]) {
            console.error(`Category '${defaultOption}' not found in the dictionary.`);
            wordCards.innerHTML = "<p>カテゴリが見つかりませんでした。</p>";
            return;
        }

        if (!Array.isArray(data[defaultOption])) {
            console.error(`Expected an array for '${defaultOption}', but got ${typeof data[defaultOption]}.`);
            wordCards.innerHTML = "<p>データ形式が正しくありません。</p>";
            return;
        }

        wordCards.innerHTML = data[defaultOption].map(createWordCard).join("");
    };

    // Display search results function
    const displayResults = async () => {
        const data = await fetchDictionaryData();
        if (!data) {
            wordCards.innerHTML = "<p>データの読み込みに失敗しました。</p>";
            return;
        }

        const searchValue = searchInput.value.toLowerCase();
        const searchTypeValue = searchType.value;
        const searchOptionValue = searchOption.value;

        // Validate the data's existence and type
        if (!data[searchOptionValue]) {
            console.error(`Data for '${searchOptionValue}' not found in the dictionary.`);
            wordCards.innerHTML = "<p>データが見つかりませんでした。</p>";
            return;
        }

        if (!Array.isArray(data[searchOptionValue])) {
            console.error(`Expected an array for '${searchOptionValue}', but got ${typeof data[searchOptionValue]}.`);
            wordCards.innerHTML = "<p>データ形式が正しくありません。</p>";
            return;
        }

        const results = [];

        data[searchOptionValue].forEach(word => {
            const searchField = searchOptionValue === "日本語訳検索" ? word["日本語訳"].toLowerCase() : word["架空言語訳"].toLowerCase();
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
