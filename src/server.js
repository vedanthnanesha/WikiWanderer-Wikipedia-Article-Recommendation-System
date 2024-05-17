const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db,auth } = require('./firebase'); 
const { collection, addDoc } = require("firebase/firestore"); 
const { fetchSignInMethodsForEmail } = require('firebase/auth');

const app = express();
const PORT = process.env.PORT || 4000;


app.use(bodyParser.json());
app.use(cors());


app.post('/check-email', (req, res) => {
  const email = req.body.email;

  fetchSignInMethodsForEmail(auth,email)
    .then((signInMethods) => {
      if (signInMethods.length > 0) {
        
        res.json({ exists: true, email });
      } else {
        
        res.json({ exists: false });
      }
    })
    .catch((error) => {
      
      res.status(500).json({ error: error.message });
    });
});


app.post('/store-article', async (req, res) => {
  const { title, articleURL, time, user, categories } = req.body;

  // Convert to strings
  const titleStr = title ? title.toString() : null;
  const articleURLStr = articleURL ? articleURL.toString() : null;
  const timeStr = time ? time.toString() : null;
  const userStr = user ? user.toString() : null;

  // Convert categories to an array of strings
  

  console.log("sent Title:", titleStr);
  console.log("sent article:", articleURLStr);
  console.log("sent time:", timeStr);
  console.log("sent user:", userStr);
  console.log("sent cate:", categories);

  try {
    const docRef = await addDoc(collection(db, "wikipediaarticles"), { 
      Title: titleStr,
      URL: articleURLStr,
      Time: timeStr,
      User: userStr,
      Categories: categories,
    });
    console.log("Document written with ID: ", docRef.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).json({ success: false, error: "Failed to store article" });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
