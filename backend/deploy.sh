docker build -t gcr.io/astral-field-448905-v3/clinical-agent-api .
docker push gcr.io/astral-field-448905-v3/clinical-agent-api

gcloud run deploy clinical-agent-api \
  --image gcr.io/astral-field-448905-v3/clinical-agent-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated