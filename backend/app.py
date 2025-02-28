from flask import Flask, request, jsonify
from transformers import pipeline
from qdrant_service import setup_collection, insert_patient_record, search_similar_patients, fetch_external_data
from sentence_transformers import SentenceTransformer
from google.cloud import tasks_v2
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)


# Generate embeddings
def generate_embedding(text):
    embedding = embedding_model.encode(text)  # Generate embedding
    return embedding.tolist()  # Convert to list for JSON serialization


# Load smaller models
embedding_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')

def generate_summary_gemini(text):
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
    response = model.generate_content(f"Summarize the following text: {text}")
    return response.text

# Generate a summary using GenAI
def generate_summary(data):
    summary = generate_summary_gemini(data)
    return summary


# Flask route to insert patient records
@app.route('/insert_patient', methods=['POST'])
def insert_patient():
    data = request.json
    patient_id = data.get('patient_id')
    text = data.get('text')
    metadata = data.get('metadata')  # Metadata should be a dictionary

    if not patient_id or not text or not metadata:
        return jsonify({"error": "Missing patient_id, embedding, or metadata"}), 400

    embedding = generate_embedding(text)
    insert_patient_record(patient_id, embedding, metadata)
    return jsonify({"message": "Patient record inserted successfully"}), 200

# Flask route to search for similar patients
@app.route('/search_similar_patients', methods=['POST'])
def search_patients():
    data = request.json
    text = data.get('text')  # Text data to generate embedding

    if not text:
        return jsonify({"error": "Missing text"}), 400

    # Generate embedding from text
    query_embedding = generate_embedding(text)
    # print(query_embedding)
    if not query_embedding:
        return jsonify({"error": "Missing query_embedding"}), 400

    # Search for similar patients
    results = search_similar_patients(query_embedding)

    # Convert ScoredPoint objects to JSON-serializable format
    serialized_results = []
    for result in results:
        serialized_results.append({
            "id": result.id,
            "payload": result.payload,
            "score": result.score
        })

    return jsonify({"similar_patients": serialized_results}), 200

# Flask route to generate a summary
@app.route('/generate_summary', methods=['POST'])
def summary():
    data = request.json.get('data')
    if not data:
        return jsonify({"error": "Missing data"}), 400

    summary_text = generate_summary(data)
    return jsonify({"summary": summary_text}), 200

@app.route('/chat', methods=['POST'])
def chat_with_agent():
    data = request.json
    clinician_id = data.get('clinician_id')
    query = data.get('query')
    if not clinician_id or not query:
        return jsonify({"error": "Missing required fields"}), 400
    query_embedding = generate_embedding(query)
    similar_patients = search_similar_patients(query_embedding)
    clinician_data = ['fetch_external_data(clinician_id)']
    summary = generate_summary({"patients": similar_patients, "clinician_data": clinician_data})
    return jsonify({"response": summary, "context": clinician_data}), 200


# Google Cloud Scheduler Task
@app.route('/schedule_task', methods=['POST'])
def schedule_task():
    client = tasks_v2.CloudTasksClient()
    project = "your-gcp-project-id"
    queue = "your-task-queue"
    location = "your-region"
    url = "https://your-cloud-function-url"  # Replace with actual URL
    parent = client.queue_path(project, location, queue)
    task = {
        "http_request": {
            "http_method": tasks_v2.HttpMethod.POST,
            "url": url,
        }
    }
    response = client.create_task(request={"parent": parent, "task": task})
    return jsonify({"message": "Task scheduled successfully", "task_name": response.name}), 200


@app.route('/')
def home():
    return "Welcome to Clinician AI assistant!"

# Initialize the collection when the app starts
setup_collection()

if __name__ == '__main__':
    app.run(debug=True)