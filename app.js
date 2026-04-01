    let cachedQuotes = []; // This is your cache
let lastIndex = -1;    // This prevents repeats
       // 1. UPDATE THIS URL with your actual Sheety Endpoint
        const API_URL = 'https://api.sheety.co/3c80c91a176d887673f5e8a9aded8290/motivator/sheet1';

        async function getNewThought() {
            const textElement = document.getElementById('quote-text');
            const authorElement = document.getElementById('quote-author');
            const errorElement = document.getElementById('error-log');

            try {
                // Smooth fade out
                textElement.style.opacity = 0;
                errorElement.innerText = "";

                const response = await fetch(API_URL);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                // Find the first list inside the Sheety object
                const sheetKey = Object.keys(data)[0];
                const rows = data[sheetKey];

                if (!rows || rows.length === 0) {
                    throw new Error("No quotes found in your Google Sheet.");
                }

                // Select a random row
                const randomRow = rows[Math.floor(Math.random() * rows.length)];

                // Use a small timeout for the fade effect
                setTimeout(() => {
                    // Match column headers 'quote' and 'author' (lowercase)
                    textElement.innerText = randomRow.quote ? `"${randomRow.quote}"` : "Empty quote found.";
                    authorElement.innerText = randomRow.author ? `- ${randomRow.author}` : "- Unknown";
                    textElement.style.opacity = 1;
                }, 500);

            } catch (err) {
                console.error("Sheety Fetch Error:", err);
                textElement.innerText = "The connection is resting.";
                textElement.style.opacity = 1;
                errorElement.innerText = "Check Sheety dashboard: Is GET enabled?";
            }
        }
        async function getNewQuote() {
    // 1. Check if cache is empty. If yes, fetch from Sheety.
    if (cachedQuotes.length === 0) {
        const response = await fetch(API_URL);
        const data = await response.json();
        const sheetKey = Object.keys(data)[0];
        cachedQuotes = data[sheetKey]; // Save all 70+ quotes here
    }

    // 2. Now pick from the CACHE instead of the API
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * cachedQuotes.length);
    } while (randomIndex === lastIndex && cachedQuotes.length > 1);

    lastIndex = randomIndex;
    const selected = cachedQuotes[randomIndex];

    // 3. Display the cached quote
    document.getElementById("quote-text").innerText = `"${selected.quote}"`;
    document.getElementById("quote-author").innerText = `- ${selected.author}`;
}

        // Run once on page load
        getNewThought();