document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const searchOption = document.getElementById('searchOption');
    const searchButton = document.getElementById('searchButton');
    const wordCards = document.getElementById('wordCards');

    // 辞書データを取得する関数
    const fetchDictionaryData = async () => {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    };

    // 単語カードを生成する関数
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

    // 検索結果を表示する関数
    const displayResults = async () => {
        const data = await fetchDictionaryData();
        const searchValue = searchInput.value.toLowerCase();
        const searchTypeValue = searchType.value;
        const searchOptionValue = searchOption.value;
        const results = [];

        data[searchOptionValue].forEach(word => {
            const searchField = searchOptionValue === "japanese" ? word["日本語訳"].toLowerCase() : word["架空言語訳"].toLowerCase();
            if (
                (searchTypeValue === "partial" && searchField.includes(searchValue)) ||
                (searchTypeValue === "exact" && searchField === searchValue) ||
                (searchTypeValue === "prefix" && searchField.startsWith(searchValue))
            ) {
                results.push(word);
            }
        });

        wordCards.innerHTML = results.map(createWordCard).join("");
    };

    searchButton.addEventListener('click', displayResults);
});
