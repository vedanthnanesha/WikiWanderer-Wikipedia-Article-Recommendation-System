# WikiWanderer: A Wikipedia Article Recommendation System

The repository spans an interactive website, a chrome extension, and a comprehensive recommendation model, all built from scratch. The inspiration for this project was to create a user-friendly system that enables users to gain deeper insights from Wikipedia, whether for research or casual exploration, and to discover a wider range of articles in their areas of interest. 

## Development Summary

### Key Features

- Developed a robust full-stack web application with an integrated chrome extension to recommend similar Wikipedia articles to users based on their recent history, using embedding models.
- Created a dataset of over 6 million Wikipedia article names and their corresponding high-dimensional vector embeddings using SBERT.
- Trained a Product Quantization Model to map the embeddings into low-dimensional subspaces using K-Means Clustering, facilitating efficient nearest neighbor search in the recommendation algorithm, and deployed it using FastAPI.
- Designed a chrome extension which tracks user article history and provides similar article suggestions, and utilized Firebase as the backend service to efficiently store data and authenticate users.
- Implemented an intuitive user interface with React, integrating with the model to fetch personalized recommendations, displaying user history via Firebase, and global Wikipedia stats through Wikipedia API.

## Technologies and Languages Utilized

- Python
- Natural Language Understanding Model
- React
- Javascript
- Firebase
- FastAPI
- CSS
- Sentence Transformers
- Product Quantization

## Running the React App

If you wish to run the React app, you can clone the repo, install the required React dependencies, and contact me at [vedanthnanesha04@gmail.com](mailto:vedanthnanesha04@gmail.com) for access to the recommendation model files, which are quite large in size (2.5GB+), and are not included in this repository.

The project is currently in its deployment phase and will be available for public use soon.

## Application Demo

- Login page for WikiWanderer:
![image](https://github.com/vedanthnanesha/Wikipedia-Extension/assets/150117424/2f51912d-5f97-4784-b30a-77d32812c3d5)

- Home page where you can view your article history and the most popular articles in the world, and navigate to their Wikipedia Pages:
![image](https://github.com/vedanthnanesha/Wikipedia-Extension/assets/150117424/71bab61c-b530-4e55-9076-2bc88a4c13de)

- Recommendations page where you can fetch article suggestions based on a query:
![image](https://github.com/vedanthnanesha/Wikipedia-Extension/assets/150117424/06a4600b-7968-495e-8f13-698de57d82ce)

- Recommendations based on your individual Wikipedia history (click on desired article):
![image](https://github.com/vedanthnanesha/Wikipedia-Extension/assets/150117424/81494d9f-7907-4749-b3a0-79afbe1aaf23)

- Integrated WikiWanderer Chrome Extension which tracks user history and suggests similar articles:
![image](https://github.com/vedanthnanesha/Wikipedia-Extension/assets/150117424/40856c19-ff6e-42eb-b428-a28b17415f68)










