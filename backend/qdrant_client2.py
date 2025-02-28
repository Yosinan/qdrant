from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams
import numpy as np

# Qdrant Cloud Configuration
QDRANT_URL = "https://a5f085b1-bd24-4395-847b-f40a09a64415.us-west-2-0.aws.cloud.qdrant.io"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.V_Ac_d-IoMjG2Cl_CcFYqpJaB7E8yfPjmQvjAEFDDNs"
COLLECTION_NAME = "patients"

# Initialize Qdrant Client with Authentication
client = QdrantClient(
    url=QDRANT_URL,
    api_key=API_KEY
)

# 🔥 Ensure the collection exists
def setup_collection():
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=768, distance=Distance.COSINE)  # Updated API for defining vectors
    )

# 🔥 Insert a new patient record
def insert_patient_record(patient_id, embedding, metadata):
    point = PointStruct(id=patient_id, vector=embedding, payload=metadata)
    client.upsert(collection_name=COLLECTION_NAME, points=[point])

# 🔥 Search for similar patients
def search_similar_patients(query_embedding):
    results = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=5,
        with_payload=True  # 🔥 Ensures patient metadata is included in results
    )
    return results
