function fetchSimilarArticles() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    let currentUrl = tabs[0].url;
    let title = currentUrl.split("/").pop().replace(/_/g, " ");

    // Make a request to Wikipedia's API to search for articles similar to the current article
    fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(title)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("API response:", data); // Log API response to console for debugging

        // Extract the list of similar articles from the API response
        let similarArticles = [];
        if (data.query && data.query.search) {
          similarArticles = data.query.search.map(result => result.title);
        }

        // Update the popup UI with the list of similar articles
        let ul = document.getElementById("similarArticles");
        ul.innerHTML = ""; // Clear previous content
        if (similarArticles.length === 0) {
          let li = document.createElement("li");
          li.textContent = "No similar articles found.";
          ul.appendChild(li);
        } else {
          similarArticles.forEach(function(article) {
            let li = document.createElement("li");
            let link = document.createElement("a");
            link.textContent = article;
            link.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(article.replace(/ /g, "_"))}`;
            link.target = "_blank"; // Open link in a new tab
            li.appendChild(link);
            ul.appendChild(li);
          });
        }
      })
      .catch(error => {
        console.error("Error fetching similar articles:", error);
        let ul = document.getElementById("similarArticles");
        ul.innerHTML = ""; // Clear previous content
        let li = document.createElement("li");
        li.textContent = "Error fetching similar articles. Please try again later.";
        ul.appendChild(li);
      });
  });
}

// Fetch similar articles when the popup is opened
fetchSimilarArticles();
