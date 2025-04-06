# import os
# import uuid
# import openai
# import pyttsx3
# import threading
# import time
# import azure.cognitiveservices.speech as speechsdk
# from flask import Flask
# from flask_socketio import SocketIO

# # Initialize Flask & SocketIO
# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")

# # OpenAI API Key
# openai.api_key = os.getenv("OPENAI_API_KEY")

# # Azure Speech Configuration
# speech_config = speechsdk.SpeechConfig(subscription=os.getenv('SPEECH_KEY'), region=os.getenv('SPEECH_REGION'))
# speech_config.speech_recognition_language = "en-US"

# # Text-to-Speech Engine
# tts_engine = pyttsx3.init()
# tts_engine.setProperty("rate", 200)  # Increase speech rate for better fluency
# tts_engine.setProperty("volume", 1.0)  # Ensure max volume

# # Memory for conversation
# conversation_memory = [
#     {"role": "system", "content": "You are an AI agent builder. Your task is to design AI agents based on conversations with users. To do this effectively, ask clear and targeted questions — including follow-ups — to fully understand the user’s goals. Focus on uncovering what kind of agent they want and what specific tasks it should perform. Keep probing until you have a complete picture."}
# ]

# # Flag to stop speaking
# stop_speaking = threading.Event()

# # Add a flag to indicate when the AI is speaking
# is_speaking = threading.Event()

# def speak_text(text):
#     """Convert text to speech and play it with interruption support."""
#     stop_speaking.clear()
#     is_speaking.set()  # Set the speaking flag
#     def run_tts():
#         tts_engine.say(text)
#         tts_engine.runAndWait()
#         is_speaking.clear()  # Clear the speaking flag after speaking
    
#     tts_thread = threading.Thread(target=run_tts)
#     tts_thread.start()
    
#     while tts_thread.is_alive():
#         if stop_speaking.is_set():
#             tts_engine.stop()
#             is_speaking.clear()  # Ensure the flag is cleared if interrupted
#             break

# def recognize_speech():
#     """Recognize speech from microphone while handling AI interruptions."""
#     # Ignore microphone input if the AI is speaking
#     if is_speaking.is_set():
#         return ""
    
#     stop_speaking.set()  # Immediately stop AI speech when user starts talking
#     time.sleep(0.3)  # Brief delay to prevent AI's response from being captured
    
#     audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
#     recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
#     print("Listening...")
    
#     result = recognizer.recognize_once()
#     if result.reason == speechsdk.ResultReason.RecognizedSpeech:
#         print(f"User: {result.text}")
#         return result.text.strip()
#     return ""

# def generate_response(user_text):
#     """Generate AI response while maintaining conversation memory."""
#     conversation_memory.append({"role": "user", "content": user_text})
#     response = openai.ChatCompletion.create(
#         model="gpt-4-turbo",
#         messages=conversation_memory,
#         max_tokens=100
#     )
    
#     ai_text = response["choices"][0]["message"]["content"].strip()
#     print(f"AI: {ai_text}")
#     conversation_memory.append({"role": "assistant", "content": ai_text})
#     return ai_text

# def interactive_conversation():
#     """Handles a continuous back-and-forth conversation between user and AI."""
#     while True:
#         user_text = recognize_speech()
#         if any(keyword in user_text.lower() for keyword in ["exit", "stop", "cancel"]):
#             print("Conversation ended.")
#             break
#         response = generate_response(user_text)
#         speak_text(response)

# if __name__ == "__main__":
#     interactive_conversation()

import os
import uuid
import openai
import pyttsx3
import threading
import time
import re
import azure.cognitiveservices.speech as speechsdk
from flask import Flask
from flask_socketio import SocketIO

# Initialize Flask & SocketIO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Azure Speech Configuration
speech_config = speechsdk.SpeechConfig(subscription=os.getenv('SPEECH_KEY'), region=os.getenv('SPEECH_REGION'))
speech_config.speech_recognition_language = "en-US"

# Text-to-Speech Engine
tts_engine = pyttsx3.init()
tts_engine.setProperty("rate", 200)  # Increase speech rate for better fluency
tts_engine.setProperty("volume", 1.0)  # Ensure max volume

# Memory for conversation
conversation_memory = [
    {"role": "system", "content": "You are an AI agent builder. Your task is to design AI agents based on conversations with users. To do this effectively, ask clear and targeted questions — including follow-ups — to fully understand the user’s goals. Focus on uncovering what kind of agent they want and what specific tasks it should perform. Keep probing until you have a complete picture."}
]

# Flag to stop speaking
stop_speaking = threading.Event()

# Add a flag to indicate when the AI is speaking
is_speaking = threading.Event()

def sanitize_ai_response(ai_text):
    """Sanitize AI's response to remove markdown formatting like **bold** or *italic*."""
    ai_text = re.sub(r'\*\*(.*?)\*\*', r'\1', ai_text)  # Remove bold (**) formatting
    ai_text = re.sub(r'\*(.*?)\*', r'\1', ai_text)      # Remove italics (*) formatting
    return ai_text

def speak_text(text):
    """Convert text to speech and play it with interruption support."""
    stop_speaking.clear()
    is_speaking.set()  # Set the speaking flag
    def run_tts():
        tts_engine.say(text)
        tts_engine.runAndWait()
        is_speaking.clear()  # Clear the speaking flag after speaking
    
    tts_thread = threading.Thread(target=run_tts)
    tts_thread.start()
    
    while tts_thread.is_alive():
        if stop_speaking.is_set():
            tts_engine.stop()
            is_speaking.clear()  # Ensure the flag is cleared if interrupted
            break

def recognize_speech():
    """Recognize speech from microphone while handling AI interruptions."""
    # Ignore microphone input if the AI is speaking
    if is_speaking.is_set():
        return ""
    
    stop_speaking.set()  # Immediately stop AI speech when user starts talking
    time.sleep(0.3)  # Brief delay to prevent AI's response from being captured
    
    audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    print("Listening...")
    
    result = recognizer.recognize_once()
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print(f"User: {result.text}")
        return result.text.strip()
    return ""

def generate_response(user_text):
    """Generate AI response while maintaining conversation memory."""
    conversation_memory.append({"role": "user", "content": user_text})
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=conversation_memory,
        max_tokens=100
    )
    
    ai_text = response["choices"][0]["message"]["content"].strip()
    print(f"AI: {ai_text}")
    conversation_memory.append({"role": "assistant", "content": ai_text})
    return ai_text

def interactive_conversation():
    """Handles a cogit config user.name
git config user.emailntinuous back-and-forth conversation between user and AI."""
    while True:
        user_text = recognize_speech()
        
        # Exit condition for the conversation
        if any(keyword in user_text.lower() for keyword in ["exit", "stop", "cancel"]):
            print("Conversation ended.")
            break
        
        # Sanitize the user input (optional, depending on use case)
        user_text = user_text.lower().strip()

        # Generate and sanitize AI response before speaking
        response = generate_response(user_text)
        response = sanitize_ai_response(response)
        speak_text(response)

if __name__ == "__main__":
    interactive_conversation()
