# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Update pip to the latest version
RUN pip install --upgrade pip

# Install dependencies
# RUN pip install --default-timeout=10000 -i https://pypi.tuna.tsinghua.edu.cn/simple  -r requirements.txt

# Install Flask and its dependencies
RUN pip install --default-timeout=1000 Flask==2.0.3 flask-cors==3.0.10

# Install qdrant-client and its dependencies
RUN pip install --default-timeout=1000 qdrant-client==0.9.0

# Install Google Cloud and other dependencies
RUN pip install --default-timeout=1000 google-cloud-tasks==2.7.1 google-generativeai==0.1.0 python-dotenv==0.19.2

# Use a faster PyPI mirror and install transformers and its dependencies
# RUN pip install --default-timeout=10000 sentence-transformers==2.1.0

# Install open ai 
RUN pip install --default-timeout=1000 openai==0.28.0

# Install gunicorn
RUN pip install --default-timeout=1000 gunicorn==20.1.0

# Install Werkzeug
RUN pip install --default-timeout=1000 Werkzeug==2.0.3

# RUN pip install --default-timeout=1000 -i https://pypi.tuna.tsinghua.edu.cn/simple spacy==3.5.0 tokenizers==0.13.3

# Download spaCy model
# RUN python -m spacy download en_core_web_trf

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV QDRANT_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.V_Ac_d-IoMjG2Cl_CcFYqpJaB7E8yfPjmQvjAEFDDNs"
ENV QDRANT_URL="https://a5f085b1-bd24-4395-847b-f40a09a64415.us-west-2-0.aws.cloud.qdrant.io"
ENV GEMINI_API_KEY="AIzaSyDe8DIz9uSPgDVtXKQ9chzuflcH85ZPZcs"
ENV OPENAI_API_KEY="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"
ENV PORT=8080

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Run the Flask app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]