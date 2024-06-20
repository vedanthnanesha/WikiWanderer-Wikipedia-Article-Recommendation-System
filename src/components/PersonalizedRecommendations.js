import React, { useState, useEffect } from 'react';
import './PersonalizedRecommendations.css'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
const { db, auth } = require('../firebase');
const { collection, orderBy, limit, getDocs, query } = require("firebase/firestore");

const PersonalizedRecommendations = () => {
  const [user] = useAuthState(auth);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationData, setRecommendationData] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchLastViewedArticles = async () => {
      if (user) {
        setLoading(true);
        setError(null);
        const userEmail = user.email;

        try {
          const userCollectionRef = collection(db, `wikipediaarticles/users/${userEmail}`);
          const articlesQuery = query(userCollectionRef, orderBy('Time', 'desc'), limit(18));
          const querySnapshot = await getDocs(articlesQuery);
          const articlesList = querySnapshot.docs.map(doc => doc.data());

          const uniqueArticles = [];
          const seenUrls = new Set();

          articlesList.forEach(article => {
            if (!seenUrls.has(article.URL)) {
              seenUrls.add(article.URL);
              uniqueArticles.push(article);
            }
          });

          setArticles(uniqueArticles);
        } catch (error) {
          console.error('Error fetching articles:', error);
          setError('Failed to fetch articles. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLastViewedArticles();
  }, [user]);  

  const fetchArticleImage = async (title) => {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
    const data = await response.json();
    return data.thumbnail ? data.thumbnail.source : '';
  };

  const getRecommendations = async (articleName) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/recommend/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: articleName }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);

      const recommendationPromises = data.recommendations.map(async (title) => {
        const imageUrl = await fetchArticleImage(title.replace(' ', '_'));
        return { title, imageUrl };
      });

      const recommendationData = await Promise.all(recommendationPromises);
      setRecommendationData(recommendationData);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to fetch recommendations. Please try again later.');
    }
  };

  const handleArticleClick = (articleName) => {
    getRecommendations(articleName);
  };

  const handlePromptSubmit = () => {
    if (userQuery.trim() !== '') {
      getRecommendations(userQuery);
    }
  };

  return (
    <div>
        <nav className="nav-bar">
                <ul> 
                    <li className="title-left">Welcome {user.displayName}</li>
                    <li><a href="#home" onClick={(e) => {e.preventDefault(); navigate('/home');}} >Home</a></li>
                    <li><a href="#recs" >Personalised Recommendations</a></li> 
                </ul>
        </nav>
        <header className="header2">
                <h1 className="titlehome">Personalized Recommendations</h1>
                <h2 className="welcome-message">Our Algorithm Searches through over 6 Million Wikipedia Articles!</h2> 
            </header>
        <div className="personalized-recommendations">
            <div className="left-column">
                <section className="last-viewed-section">
                    <h3 className="section-title">Click to Find Similar Articles</h3>
                    <div className="article-list">
                        {loading ? (
                            <p>Loading articles...</p>
                        ) : (
                            articles.map((article, index) => (
                                <div key={index} className="article-item" onClick={() => handleArticleClick(article.Title)}>
                                    <span>{article.Title}</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
            <div className="right-column">
                <section className="prompt-section">
                    <h3 className="section-title">Get Recommendations Based on a Prompt</h3>
                    <div className="input-container">
                    <input
                        className="inputbox"
                        type="text"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        placeholder="Enter Search Text"
                        
                    />
                    <button className="button" onClick={handlePromptSubmit}>
                        Begin Exploration
                    </button>
                    </div>
                    {error && <p className="error">{error}</p>}
                </section>
            </div>
        </div>

        <section className="recommendation-section">
            <h3 className="section-title">Your Recommendations</h3>
            
            <div className="recommendation-list">
                {recommendationData.map((rec, index) => (
                    <div className="recommendation-item" key={index}>
                        <a
                            className="recommendation-link"
                            href={`https://en.wikipedia.org/wiki/${rec.title.replace(' ', '_')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {rec.imageUrl && <img src={rec.imageUrl} alt={rec.title} className="recommendation-image" />}
                            {rec.title}
                        </a>
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
};

export default PersonalizedRecommendations;
