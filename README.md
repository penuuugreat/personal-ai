# 🤖 Penuu — Personal Assistant AI

> A voice-enabled, AI-powered personal assistant built in Python. Handles reminders, calendar events, weather lookups, web searches, and open-ended AI queries — all from a single conversational interface.

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python)](https://python.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?logo=openai)](https://openai.com)
[![Google Calendar](https://img.shields.io/badge/Google-Calendar_API-4285F4?logo=googlecalendar)](https://developers.google.com/calendar)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌤 **Weather** | Real-time weather via OpenWeatherMap API |
| 📅 **Calendar** | Add & list Google Calendar events |
| ⏰ **Reminders** | Set and check time-based reminders |
| 🔍 **Web Search** | Launch Google searches from voice or text |
| 🤖 **AI Queries** | Ask GPT-4 anything via `ask ai <question>` |
| 🎙 **Voice Mode** | Full speech recognition + text-to-speech output |
| 🗣 **Text Mode** | Classic terminal-based chat interface |

---

## 🚀 Live Demo

> **[👉 Try the Interactive Demo](https://your-demo-url.vercel.app)**

The live demo runs a simulated version of Penuu in the browser — no installation required. Enter your Anthropic API key in the demo to enable real AI responses.

---

## 📁 Project Structure

```
penuu-assistant/
├── personal_assisstant.py   # Core assistant class (PersonalAssistantAI)
├── assistant.py             # Lightweight OpenAI wrapper (Assistant)
├── main.py                  # Entry point
├── config.py                # App-wide configuration & constants
├── google_calendar.py       # Google Calendar API integration
├── utils.py                 # Logging setup & helper utilities
├── requirements.txt         # Python dependencies
├── .env.example             # Environment variable template
└── credentials.json         # Google OAuth credentials (not committed)
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/penuu-assistant.git
cd penuu-assistant
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
OPENAI_API_KEY=sk-...
WEATHER_API_KEY=your_openweathermap_key
GOOGLE_CREDENTIALS_FILE=credentials.json
```

### 4. Set up Google Calendar API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project → enable the **Google Calendar API**
3. Create **OAuth 2.0 credentials** → download as `credentials.json`
4. Place `credentials.json` in the project root
5. On first run, a browser window will open to authorize access

### 5. Run the assistant

```bash
python main.py
```

You'll be prompted to choose **voice** or **text** mode.

---

## 🗣 Command Reference

| Command | Example |
|---|---|
| Greet | `hello` / `hi` / `hey` |
| Weather | `what is the weather in Nairobi` |
| Current weather | `what is the weather now` |
| Set reminder | `remind me to call mom at 2025-12-01 14:00` |
| Check reminders | `check reminders` |
| Web search | `search for best Python tutorials` |
| List events | `list calendar events` |
| Add event | `add calendar event Team Meeting, Weekly sync, 2025-12-10 09:00, 2025-12-10 10:00` |
| Schedule | `schedule Dentist, 2025-12-15 10:00, 2025-12-15 11:00` |
| Ask AI | `ask ai what is the capital of France` |
| Exit | `bye` / `exit` / `quit` |

---

## 🔑 API Keys & Services

| Service | Purpose | Get it |
|---|---|---|
| OpenAI | AI responses (GPT-4) | [platform.openai.com](https://platform.openai.com) |
| OpenWeatherMap | Weather data | [openweathermap.org](https://openweathermap.org/api) |
| Google Calendar | Calendar integration | [Google Cloud Console](https://console.cloud.google.com) |

---

## 🛠 Configuration

All settings live in `config.py`:

```python
DEFAULT_MODEL   = "gpt-4-turbo"   # Change AI model here
MAX_TOKENS      = 2000            # Max response length
ENABLE_VOICE    = True            # Toggle voice support
MEMORY_SIZE     = 10              # Conversation turns to retain
```

---

## 📦 Dependencies

```
openai>=1.0.0
SpeechRecognition>=3.10.0
pyttsx3>=2.90
requests>=2.31.0
geopy>=2.4.1
python-dotenv>=1.0.0
google-auth>=2.23.0
google-auth-oauthlib>=1.1.0
google-api-python-client>=2.104.0
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">Built with ❤️ by <a href="https://github.com/your-username">your-username</a></p>
