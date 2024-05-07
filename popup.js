function decodeHTMLEntities(text) {
  
  const tempElement = document.createElement("div");
  tempElement.innerHTML = text;
  return tempElement.textContent || tempElement.innerText;
}

function fetchSimilarArticles() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    let currentUrl = tabs[0].url;
    let title = currentUrl.split("/").pop().replace(/_/g, " ");

    fetch(`https://en.wikipedia.org/api/rest_v1/page/related/${encodeURIComponent(title)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("API response:", data); 

        let similarArticles = [];
        if (data && data.pages) {
          similarArticles = data.pages.map(page => {
          
            const decodedTitle = decodeHTMLEntities(page.titles.display);
           
            return decodedTitle.replace(/<[^>]*>/g, "");
          });
        }

        
        let ul = document.getElementById("similarArticles");
        ul.innerHTML = ""; 
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
            link.target = "_blank"; 
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


fetchSimilarArticles();
