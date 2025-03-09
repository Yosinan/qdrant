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
RUN pip install --default-timeout=10000 -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV QDRANT_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.V_Ac_d-IoMjG2Cl_CcFYqpJaB7E8yfPjmQvjAEFDDNs"
ENV QDRANT_URL="https://a5f085b1-bd24-4395-847b-f40a09a64415.us-west-2-0.aws.cloud.qdrant.io"
ENV GEMINI_API_KEY="AIzaSyDe8DIz9uSPgDVtXKQ9chzuflcH85ZPZcs"
ENV OPENAI_API_KEY="your-openai-api-key"
ENV PORT=8080

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Run the Flask app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]