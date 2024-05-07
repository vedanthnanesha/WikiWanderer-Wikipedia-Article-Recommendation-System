// Content script to interact with Wikipedia pages

// Example function to extract information about the current Wikipedia article
function extractArticleInfo() {
    // Extract the title of the Wikipedia article from the page
    var title = document.querySelector('h1#firstHeading').textContent;
    // Extract other relevant information about the article if needed
    // For example, you could extract categories, links, or text content
    // and use them to recommend similar articles
    return {
      title: title,
      // Add more properties as needed
    };
  }
  
  // Example usage of the extractArticleInfo function
  var articleInfo = extractArticleInfo();
  console.log("Current Wikipedia article title:", articleInfo.title);
  