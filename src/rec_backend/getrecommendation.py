from fastapi import FastAPI
import json
from pathlib import Path
import numpy as np
import pyarrow as pa
from sentence_transformers import SentenceTransformer
import nanopq
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

codewords = np.array(json.loads(Path("codewords.json").read_text()), dtype=np.float32)

input_path = 'embeddings.arrow'
table = pa.ipc.open_file(input_path).read_all()
df = table.to_pandas()
embeddings = df.to_numpy()

input_path = 'titles.arrow'
table1 = pa.ipc.open_file(input_path).read_all()
df1 = table1.to_pandas()
titles = df1.to_numpy()

minilml6v2 = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

(cwM, cwKs, cwDs) = codewords.shape
pq48x7 = nanopq.PQ(M=48, Ks=128)
pq48x7.Ds = cwDs
pq48x7.codewords = codewords

def recommend_top10(article_name):
    query = minilml6v2.encode(article_name)
    query_dists = pq48x7.dtable(query).adist(embeddings)
    top10_indices = np.argsort(query_dists)[:10]
    top10_titles = titles[top10_indices]
    top10_distances = query_dists[top10_indices]
    return top10_titles, top10_distances

class QueryInput(BaseModel):
    query: str

@app.post("/recommend/")
async def get_recommendations(query_input: QueryInput):
    query = query_input.query
    top10_articles, top10_distances = recommend_top10(query)

    response = {
       
        "recommendations": [article[0] for article in top10_articles]
    }

    return response