from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams
import numpy as np
import requests
from dotenv import load_dotenv
import os

load_dotenv()

# Qdrant Cloud Configuration
QDRANT_URL = os.getenv("QDRANT_URL")
API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "patients"


# Initialize Qdrant Client with Authentication
client = QdrantClient(
    url=QDRANT_URL,
    api_key=API_KEY
)

# Ensure the collection exists
def setup_collection():
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE)  # Updated API for defining vectors
    )

# Insert a new patient record
def insert_patient_record(patient_id, embedding, metadata):
    point = PointStruct(id=patient_id, vector=embedding, payload=metadata)
    client.upsert(collection_name=COLLECTION_NAME, points=[point])

# Search for similar patients
def search_similar_patients(query_embedding):
    results = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=5,
        with_payload=True  # Ensures patient metadata is included in results
    )
    return results

# Fetch external API data (e.g., EHR, research papers)
def fetch_external_data(clinician_id):
    # Simulating an API call

    return {
        "clinician_id": clinician_id,
        "specialization": "endocrinology",
        "preferences": {
            "language": "en",
            "treatment_approach": "holistic"
        }
    }

    # response = requests.get(f"https://api.example.com/clinician/{clinician_id}/data")
    # return response.json() if response.status_code == 200 else {}

