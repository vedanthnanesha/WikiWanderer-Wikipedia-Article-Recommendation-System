
function checkEmail(email) {
  fetch('http://localhost:4000/check-email', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.exists) {
      console.log("Email exists");
      saveEmail(data.email);
    } else {
      console.log("Email does not exist");
      promptForEmail();
    }
  })
  .catch(error => {
    console.error('Error checking email:', error);
    promptForEmail();
  });
}


function saveEmail(email) {
  chrome.storage.local.set({ 'userEmail': email }, function() {
    console.log('Email saved:', email);
    displayStoredEmail(email);
  });
}


function promptForEmail() {
  document.getElementById('invalidEmailMessage').style.display = 'block';
  setTimeout(() => {
    document.getElementById('invalidEmailMessage').style.display = 'none';
  }, 3000);
}



function displayStoredEmail(email) {
  document.getElementById('emailForm').style.display = 'none';
  document.getElementById('changeEmailForm').style.display = 'block';
  const emailDisplay = document.getElementById('loggedInEmail');
  emailDisplay.textContent = `Logged in as: ${email}`;
  emailDisplay.style.display = 'block';
  document.getElementById('emailChangeSuccessMessage').style.display = 'none';
}



document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('emailInput').value;
  checkEmail(email);
});


document.getElementById('changeEmailForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const newEmail = document.getElementById('newEmailInput').value;
  checkEmail(newEmail);
});


function decodeHTMLEntities(text) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = text;
  return tempElement.textContent || tempElement.innerText;
}


function fetchSimilarArticles() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    let currentUrl = tabs[0].url;
    let title = currentUrl.split("/").pop().replace(/_/g, " ");

    fetch(`https://en.wikipedia.org/api/rest_v1/page/related/${encodeURI(title)}`)
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
        ul.innerHTML = ""; 
        let li = document.createElement("li");
        li.textContent = "Error fetching similar articles. Please try again later.";
        ul.appendChild(li);
      });
  });
}
function initialize() {
  chrome.storage.local.get('userEmail', function(result) {
    if (result.userEmail) {
      displayStoredEmail(result.userEmail);
    } else {
      document.getElementById('emailForm').style.display = 'block';
      document.getElementById('changeEmailForm').style.display = 'none';
    }
  });

  
}
function fetchArticleInfoAndSendToServer() {
  chrome.storage.local.get('userEmail', function(result) {
    if (!result.userEmail) {
      console.log("Email not found in local storage.");
      return;
    }

    const user = result.userEmail; 
    console.log("User:", user);

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentUrl = tabs[0].url;
      const articleURL = currentUrl;
      console.log("Article URL:", articleURL);

      const title = decodeURIComponent(currentUrl.split("/").pop().replace(/_/g, " ")); 
      console.log("Title:", title);

      function getISTTime() {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
        const istTime = new Date(now.getTime() + istOffset);
      
        return istTime.toISOString();
      }
      
      const time = getISTTime();
      console.log("Time:", time);
      

      var url = "https://en.wikipedia.org/w/api.php";

      var params = {
        action: "query",
        format: "json",
        prop: "categories",
        titles: title,
        formatversion: 2,
        clshow: "!hidden",
        cllimit: 10
      };

      url = url + "?origin=*";
      Object.keys(params).forEach(function(key) {
        url += "&" + key + "=" + params[key];
      });
      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(response) {
          console.log("API Response:", response); 

          var pages = response.query.pages;
          const categories = [];
          for (var p in pages) {
            if (pages[p].categories) {
              for (var cat of pages[p].categories) {
                if (categories.length >= 5) {
                  break;
                }
                var categoryTitle = cat.title.replace("Category:", "").trim();
                
                if (!categoryTitle.startsWith('Articles with') && !categoryTitle.startsWith('Wikipedia') && !categoryTitle.startsWith('All')) {
                  categories.push(categoryTitle);
                }
              }
            } else {
              console.log("No categories found for page:", pages[p]);
            }
          }

          console.log("Filtered Categories:", categories);

          
          fetch('http://localhost:4000/store-article', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              articleURL,
              time,
              user,
              categories,
            }),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log("Data sent successfully:", data);
          })
          .catch(error => {
            console.error("Error sending data to server:", error);
          });
        })
        .catch(function(error) {
          console.log("Error fetching categories:", error);
        });
    });
  });
}


document.addEventListener('DOMContentLoaded', initialize);
fetchSimilarArticles();
fetchArticleInfoAndSendToServer()
