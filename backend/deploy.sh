docker build -t gcr.io/astral-field-448905-v3/clinical-agent .
docker push gcr.io/astral-field-448905-v3/clinical-agent

gcloud run deploy clinical-agent \
  --image gcr.io/astral-field-448905-v3/clinical-agent \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated