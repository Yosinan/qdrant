import random
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
    existing_collections = client.get_collections()
    collection_names = [col.name for col in existing_collections.collections]

    if COLLECTION_NAME not in collection_names:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=768, distance=Distance.COSINE)
        )

# Insert a new patient record
def insert_patient_record(patient_id, embedding, metadata):
    point = PointStruct(id=patient_id, vector=embedding, payload=metadata)
    client.upsert(collection_name=COLLECTION_NAME, points=[point], wait=True)

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

    clinicians_db = {
        "doctor_001": {
            "name": "Dr. Emily Carter",
            "specialization": "Cardiology",
            "years_of_experience": 12,
            "hospital": "Johns Hopkins Hospital",
            "preferences": {
                "language": "English",
                "treatment_approach": "Evidence-based medicine"
            }
        },
        "doctor_002": {
            "name": "Dr. Ahmed Yusuf",
            "specialization": "Neurology",
            "years_of_experience": 15,
            "hospital": "Mayo Clinic",
            "preferences": {
                "language": "English, Arabic",
                "treatment_approach": "Holistic approach"
            }
        },
        "doctor_003": {
            "name": "Dr. Aisha Mwangi",
            "specialization": "Endocrinology",
            "years_of_experience": 10,
            "hospital": "Nairobi General Hospital",
            "preferences": {
                "language": "Swahili, English",
                "treatment_approach": "Personalized care"
            }
        }
    }

    return clinicians_db.get(clinician_id, {
        "name": f"Dr. Unknown ({clinician_id})",
        "specialization": "General Practitioner",
        "years_of_experience": random.randint(5, 20),
        "hospital": "Unknown Hospital",
        "preferences": {
            "language": "English",
            "treatment_approach": "Standard medical guidelines"
        }
    })

    # response = requests.get(f"https://api.example.com/clinician/{clinician_id}/data")
    # return response.json() if response.status_code == 200 else {}

