docker build -t gcr.io/astral-field-448905-v3/qdrant-backend .
docker push gcr.io/astral-field-448905-v3/qdrant-backend

gcloud run deploy qdrant-backend \
  --image gcr.io/astral-field-448905-v3/qdrant-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated