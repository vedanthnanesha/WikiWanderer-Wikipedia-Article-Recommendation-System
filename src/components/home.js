import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';
import logo from './WikiWandererLogoReal2.png'; 
const { db, auth } = require('../firebase');
const { collection, query, orderBy, limit, getDocs } = require("firebase/firestore");


export default function WikiWanderer() {
    const [user] = useAuthState(auth);
    const [articles, setArticles] = useState([]);
    const [topArticles, setTopArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
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

        const fetchTopArticles = async () => {
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0'); 
                const day = String(today.getDate()-2).padStart(2, '0');
                const dateStr = `${year}/${month}/${day}`;
                const urlrequest = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/';
                const realurl = urlrequest + dateStr;
                const response = await axios.get(realurl);
                const topArticlesData = response.data.items[0].articles.slice(4, 18);
                setTopArticles(topArticlesData);
            } catch (error) {
                console.error('Error fetching top articles:', error);
                setError('Failed to fetch top articles. Please try again later.');
            }
        };

        if (user) {
            fetchArticles();
        }
        fetchTopArticles();
    }, [user]);

    return (
        <div className="wikiwanderer-container">
            <nav className="nav-bar">
                <ul> 
                    <li className="title-left">Welcome {user.displayName}</li>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#recs" onClick={(e) => { e.preventDefault(); navigate('/recs'); }}>Personalised Recommendations</a></li> 
                </ul>
            </nav>
            <header className="header">
                <img src={logo} alt="WikiWanderer Logo" className="logo-image" />
                <h2 className="welcome-message">Explore the Vast Depths of Wikipedia!</h2> 
            </header>
            <div className="split-screen">
                <div className="left-column">
                    <section className="recent-articles">
                        <h3 className="section-title1">Your Last Viewed Articles:</h3>
                        <ul className="article-list">
                            {articles.map((article, index) => (
                                <li key={index} className="article-item">
                                    <h4 className="article-title">
                                        <a href={article.URL} target="_blank" rel="noopener noreferrer">{article.Title}</a>
                                    </h4>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
                <div className="right-column">
                    <section className="top-articles">
                        <h3 className="section-title1">Top Most Viewed Articles in the World:</h3>
                        <ul className="article-list">
                            {topArticles.map((article, index) => (
                                <li key={index} className="article-item">
                                    <h4 className="article-title">
                                        <a href={`https://en.wikipedia.org/wiki/${article.article}`} target="_blank" rel="noopener noreferrer">{article.article.replace(/_/g, ' ')}</a>
                                    </h4>
                                </li>
                            ))}
                        </ul>
                    </section>
                    {loading && <p>Loading articles...</p>}
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
}
