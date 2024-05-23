const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db,auth } = require('./firebase'); 
const { addDoc, collection} = require("firebase/firestore"); 
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

  const useremail = user ? user.toString() : null;
  const titleStr = title ? title.toString() : null;
  const articleURLStr = articleURL ? articleURL.toString() : null;
  const timeStr = time ? time.toString() : null;

  console.log("sent Title:", titleStr);
  console.log("sent article:", articleURLStr);
  console.log("sent time:", timeStr);
  console.log("sent user:", user);
  console.log("sent cate:", categories);

  try {
    // Reference to the user's subcollection within wikipediaarticles
    const userSubcollectionRef = collection(db, `wikipediaarticles/users/${useremail}`);


    // Data to be added to the subcollection
    const subcollectionData = {
      Title: titleStr,
      URL: articleURLStr,
      Time: timeStr,
      Categories: categories,
    };

    // Add the data to the user's subcollection, letting Firestore generate a unique ID
    await addDoc(userSubcollectionRef, subcollectionData);
    console.log("Document written in subcollection");
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).json({ success: false, error: "Failed to store article" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
