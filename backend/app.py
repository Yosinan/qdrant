import datetime
from flask import Flask, json, logging, request, jsonify
from flask_cors import CORS
import openai
from qdrant_service import setup_collection, insert_patient_record, search_similar_patients, fetch_external_data
# from sentence_transformers import SentenceTransformer
from google.cloud import tasks_v2
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


genai.configure(api_key=GEMINI_API_KEY)
openai.api_key = OPENAI_API_KEY

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the embedding model
# embedding_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')


# Generate embeddings using OpenAI
def generate_embedding(text):

    response = openai.Embedding.create(
        input=text,
        model="text-embedding-ada-002"
    )

    return response['data'][0]['embedding']

def generate_summary_gemini(text):
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
    response = model.generate_content(f"Summarize the following text: {text}")
    return response.text if response else "Summary not available."


# Flask route to insert patient records
@app.route('/insert_patient', methods=['POST'])
def insert_patient():
    try:
        data = request.json
        patient_id = data.get('patient_id')
        text = data.get('text')
        metadata = data.get('metadata', {})

        if not patient_id or not text:
            return jsonify({"error": "Missing patient_id or text"}), 400

        embedding = generate_embedding(text)
        # print(embedding)
        insert_patient_record(patient_id, embedding, metadata)
        return jsonify({"message": "Patient record inserted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Flask route to search for similar patients
@app.route('/search_similar_patients', methods=['POST'])
def search_patients():
    try:
        data = request.json
        text = data.get('text')

        if not text:
            return jsonify({"error": "Missing text"}), 400

        query_embedding = generate_embedding(text)
        results = search_similar_patients(query_embedding)

        serialized_results = [{
            "id": result.id,
            "payload": result.payload,
            "score": result.score
        } for result in results]

        return jsonify({"similar_patients": serialized_results if serialized_results else "No matches found"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Flask route to generate a summary
@app.route('/generate_summary', methods=['POST'])
def summary():
    data = request.json.get('data')
    if not data:
        return jsonify({"error": "Missing data"}), 400

    summary_text = generate_summary_gemini(data)
    return jsonify({"summary": summary_text}), 200

@app.route('/search', methods=['POST'])
def search():
    try:
        data = request.json
        clinician_id = data.get('clinician_id')
        query = data.get('query')
        similarity_threshold = data.get('similarity_threshold')

        if not clinician_id or not query:
            return jsonify({"error": "Missing required fields"}), 400

        # Step 1: Answer the query using Gemini
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
        response = model.generate_content(query)
        answer = response.text

        # Step 2: Find similar patients (optional)
        query_embedding = generate_embedding(query)
        if query_embedding is None:
            return jsonify({"error": "Failed to generate query embedding"}), 500

        similar_patients = search_similar_patients(query_embedding, similarity_threshold)


        # Serialize patient search results
        serialized_patients = [{
            "id": patient.id,
            **patient.payload,  # Flatten payload
            "score": round(patient.score, 4)  # Limit score precision
        } for patient in similar_patients]

        return jsonify({
            "query": query,
            "answer": answer,  # Direct answer from Gemini
            "matched_patients": serialized_patients,  # Similar patients
            "clinician_info": {
                "name": "Dr. Emily Carter",
                "specialization": "Cardiology",
                "hospital": "Johns Hopkins Hospital"
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat_with_agent():
    try:
        data = request.json
        clinician_id = data.get('clinician_id')
        query = data.get('query')

        if not clinician_id or not query:
            return jsonify({"error": "Missing required fields"}), 400

        # Get clinician data
        clinician_data = fetch_external_data(clinician_id)
        
        # Generate embedding for search
        query_embedding = generate_embedding(query)
        similar_patients = search_similar_patients(query_embedding)

        # Serialize similar patient data
        serialized_patients = [{
            "id": patient.id,
            "payload": patient.payload,
            "score": patient.score
        } for patient in similar_patients]

        print(clinician_data["name"])
        # AI-enhanced response generation
        prompt = f"""
        You are an AI clinical assistant specializing in {clinician_data['specialization']}.
        A clinician ({clinician_data['name']}, {clinician_data['years_of_experience']} years experience) has asked:

        "{query}"

        Here are some relevant patient records:
        {json.dumps(serialized_patients, indent=2)}

        Based on this, provide a professional response using {clinician_data['preferences']['treatment_approach']} principles.
        """

        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
        response = model.generate_content(prompt)

        return jsonify({
            "response": response.text if response else "I couldn't generate an answer.",
            "context": {
                "clinician_id": clinician_id,
                "clinician_data": clinician_data,
                "similar_patients": serialized_patients
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/')
def home():
    return "Welcome to Clinician AI assistant!"

# Initialize the collection when the app starts
setup_collection()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)