from transformers import pipeline

summarizer = pipeline("summarization")

def generate_summary(data):
    summary = summarizer(str(data), max_length=100, min_length=30, do_sample=False)
    return summary[0]["summary_text"]
