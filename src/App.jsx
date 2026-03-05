import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are Penuu, a personal AI assistant. You are helpful, friendly, and concise. You can help with:
- Greetings and casual conversation
- Weather questions (respond with mock/simulated data since you can't access real APIs)
- Setting reminders (simulate storing them)
- Searching the web (describe what you'd search for)
- Calendar events (simulate adding/listing events)
- General AI questions and tasks

Keep responses short and conversational. When simulating features like weather or calendar, provide realistic mock data. Format calendar events and reminders clearly.`;

const SAMPLE_COMMANDS = [
  "Hello! What can you do?",
  "What is the weather in Nairobi?",
  "Remind me to call mom at 2025-12-01 14:00",
  "Search for best restaurants in Nairobi",
  "List calendar events",
  "Add calendar event Team Meeting, Weekly sync, 2025-12-10 09:00, 2025-12-10 10:00",
  "Ask AI what is the meaning of life?",
];

const FileTab = ({ file, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      background: active ? "#1a1a2e" : "transparent",
      border: "none",
      borderBottom: active ? "2px solid #00d4ff" : "2px solid transparent",
      color: active ? "#00d4ff" : "#888",
      cursor: "pointer",
      fontSize: "13px",
      fontFamily: "'JetBrains Mono', monospace",
      whiteSpace: "nowrap",
      transition: "all 0.2s",
    }}
  >
    {file}
  </button>
);

const CodeBlock = ({ code }) => (
  <pre
    style={{
      margin: 0,
      padding: "20px",
      overflowX: "auto",
      fontSize: "12px",
      lineHeight: "1.7",
      color: "#a8b2d8",
      fontFamily: "'JetBrains Mono', monospace",
      background: "transparent",
    }}
  >
    <code>{code}</code>
  </pre>
);

const MESSAGE_COLORS = {
  user: { bg: "#0f3460", border: "#1a4a7a", label: "YOU" },
  assistant: { bg: "#0d1b2a", border: "#00d4ff33", label: "PENUU" },
  system: { bg: "#1a0a00", border: "#ff6b0033", label: "SYSTEM" },
};

export default function App() {
  const [activeTab, setActiveTab] = useState("demo");
  const [activeFile, setActiveFile] = useState("personal_assisstant.py");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm Penuu, your personal AI assistant 👋\n\nI can help you with weather, reminders, calendar events, web searches, and general questions. Try one of the sample commands below or type your own!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userText },
        {
          role: "system",
          content: "⚠️ Please enter your Anthropic API key above to enable AI responses.",
        },
      ]);
      setInput("");
      return;
    }

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const conversationHistory = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [...conversationHistory, { role: "user", content: userText }],
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const reply = data.content?.[0]?.text || "I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `❌ Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const files = {
    "personal_assisstant.py": `import datetime, webbrowser, random, requests
import speech_recognition as sr
import pyttsx3
from geopy.geocoders import Nominatim
from google_calendar import PersonalAssistant
import openai, os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

class PersonalAssistantAI:
    def __init__(self):
        self.reminders = []
        self.name = "Penuu"
        self.responses = {
            "greetings": ["Hello! How can I help you?", "Hi there!", "Greetings!"],
            "farewell":  ["Goodbye!", "See you later!", "Have a nice day!"],
            "unknown":   ["I'm not sure how to help with that.", "Could you rephrase that?"]
        }
        self.weather_api_key = os.getenv('WEATHER_API_KEY')
        self.calendar_assistant = PersonalAssistant("credentials.json")
        openai.api_key = os.getenv('OPENAI_API_KEY')

    def handle_command(self, command):
        command = command.lower()
        if "ask ai" in command:
            question = command.split("ask ai")[1].strip()
            return self.get_ai_response(question)
        if any(w in command for w in ["hi", "hello", "hey"]):
            return self.greet()
        elif "remind me to" in command:
            task = command.split("remind me to")[1].split("at")[0].strip()
            time = command.split("at")[1].strip()
            return self.add_reminder(task, time)
        elif "weather in" in command:
            city = command.split("in")[-1].strip()
            return self.check_weather(city)
        elif "search for" in command:
            query = command.split("search for")[1].strip()
            return self.search_web(query)
        elif "list calendar events" in command:
            return self.list_calendar_events()
        elif "add calendar event" in command:
            parts = command.split("add calendar event")[1].strip().split(",")
            return self.add_calendar_event(*[p.strip() for p in parts])
        return random.choice(self.responses["unknown"])`,

    "assistant.py": `import openai
import logging
from config import *

class Assistant:
    def __init__(self):
        openai.api_key = OPENAI_API_KEY
        self.context = []
        self.model = DEFAULT_MODEL
        logging.info(f"Assistant initialized with model: {self.model}")

    def start(self):
        logging.info(f"Starting {APP_NAME}")
        try:
            while True:
                user_input = input("You: ")
                if user_input.lower() in ['exit', 'quit']:
                    break
                response = self.process_input(user_input)
                print(f"Assistant: {response}")
        except KeyboardInterrupt:
            logging.info("Assistant stopped by user")

    def process_input(self, user_input):
        try:
            response = openai.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": user_input}],
                max_tokens=MAX_TOKENS
            )
            return response.choices[0].message.content
        except Exception as e:
            logging.error(f"Error processing input: {e}")
            return "I apologize, but I encountered an error."`,

    "config.py": `# ─── AI Settings ───────────────────────────────────────
OPENAI_API_KEY  = "your-openai-api-key-here"
DEFAULT_MODEL   = "gpt-4-turbo"
MAX_TOKENS      = 2000

# ─── App Settings ──────────────────────────────────────
APP_NAME    = "Personal Assistant AI"
DEBUG_MODE  = True
LOG_LEVEL   = "INFO"

# ─── Voice Settings ────────────────────────────────────
ENABLE_VOICE    = True
VOICE_LANGUAGE  = "en-US"
SPEECH_RATE     = 1.0

# ─── Directories ───────────────────────────────────────
LOG_DIR   = "logs"
CACHE_DIR = "cache"
DATA_DIR  = "data"

# ─── Database ──────────────────────────────────────────
DB_HOST     = "localhost"
DB_PORT     = 5432
DB_NAME     = "assistant_db"
DB_USER     = "user"
DB_PASSWORD = "password"

# ─── Server ────────────────────────────────────────────
HOST         = "127.0.0.1"
PORT         = 5000
ENABLE_HTTPS = False

# ─── Memory ────────────────────────────────────────────
MEMORY_SIZE    = 10    # conversation turns to keep
CONTEXT_LENGTH = 4096  # max context window`,

    "main.py": `from assistant import Assistant
from utils import setup_logging
from config import *

def main():
    setup_logging()
    assistant = Assistant()
    assistant.start()

if __name__ == "__main__":
    main()`,

    "utils.py": `# ─── utils.py (missing file — added for demo) ──────────
import logging
import os
from config import LOG_DIR, LOG_LEVEL

def setup_logging():
    """Configure application-wide logging."""
    os.makedirs(LOG_DIR, exist_ok=True)
    log_file = os.path.join(LOG_DIR, "assistant.log")

    logging.basicConfig(
        level=getattr(logging, LOG_LEVEL, logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler(),
        ],
    )
    logging.info("Logging initialised → %s", log_file)

def sanitize_input(text: str) -> str:
    """Strip and lower-case user input."""
    return text.strip().lower()

def chunk_list(lst, size):
    """Yield successive chunks from a list."""
    for i in range(0, len(lst), size):
        yield lst[i : i + size]`,

    "google_calendar.py": `# ─── google_calendar.py (missing file — added for demo) ─
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime
import os

SCOPES = ["https://www.googleapis.com/auth/calendar"]

class PersonalAssistant:
    def __init__(self, credentials_file: str):
        self.service = self._authenticate(credentials_file)

    def _authenticate(self, credentials_file):
        creds = None
        if os.path.exists("token.json"):
            creds = Credentials.from_authorized_user_file("token.json", SCOPES)
        if not creds or not creds.valid:
            flow = InstalledAppFlow.from_client_secrets_file(credentials_file, SCOPES)
            creds = flow.run_local_server(port=0)
            with open("token.json", "w") as f:
                f.write(creds.to_json())
        return build("calendar", "v3", credentials=creds)

    def list_events(self, max_results=10):
        now = datetime.utcnow().isoformat() + "Z"
        result = (
            self.service.events()
            .list(calendarId="primary", timeMin=now,
                  maxResults=max_results, singleEvents=True,
                  orderBy="startTime")
            .execute()
        )
        events = result.get("items", [])
        return [
            {
                "summary":    e.get("summary", "No Title"),
                "start_time": e["start"].get("dateTime", e["start"].get("date")),
                "end_time":   e["end"].get("dateTime", e["end"].get("date")),
            }
            for e in events
        ]

    def add_event(self, summary, description, start_time, end_time):
        event = {
            "summary":     summary,
            "description": description,
            "start": {"dateTime": start_time, "timeZone": "Africa/Nairobi"},
            "end":   {"dateTime": end_time,   "timeZone": "Africa/Nairobi"},
        }
        created = self.service.events().insert(
            calendarId="primary", body=event
        ).execute()
        return f"Event created: {created.get('htmlLink')}"`,

    "requirements.txt": `# ─── requirements.txt ──────────────────────────────────
openai>=1.0.0
SpeechRecognition>=3.10.0
pyttsx3>=2.90
requests>=2.31.0
geopy>=2.4.1
python-dotenv>=1.0.0
google-auth>=2.23.0
google-auth-oauthlib>=1.1.0
google-api-python-client>=2.104.0

# Install with:
#   pip install -r requirements.txt`,

    ".env.example": `# ─── .env.example ──────────────────────────────────────
# Copy to .env and fill in real values

# OpenAI
OPENAI_API_KEY=sk-...

# OpenWeatherMap  (free tier works)
WEATHER_API_KEY=...

# Google Calendar OAuth credentials file path
GOOGLE_CREDENTIALS_FILE=credentials.json`,
  };

  const pulse = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0d1b2a; }
    ::-webkit-scrollbar-thumb { background: #00d4ff44; border-radius: 3px; }
    textarea:focus { outline: none; }
    input:focus { outline: none; }
  `;

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", color: "#e0e8f0", fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{pulse}</style>

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, #00d4ff08 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, #7c3aed0a 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #00d4ff22", display: "flex", alignItems: "center", gap: "12px", background: "#050d1acc", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #00d4ff, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.05em", color: "#00d4ff", fontFamily: "'JetBrains Mono', monospace" }}>PENUU</div>
          <div style={{ fontSize: 11, color: "#556", letterSpacing: "0.15em" }}>PERSONAL ASSISTANT AI · LIVE DEMO</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["demo", "files"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "6px 18px", background: activeTab === t ? "#00d4ff15" : "transparent", border: `1px solid ${activeTab === t ? "#00d4ff" : "#334"}`, borderRadius: 6, color: activeTab === t ? "#00d4ff" : "#667", cursor: "pointer", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {t === "demo" ? "💬 Demo" : "📁 Files"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "demo" ? (
        <div style={{ display: "flex", height: "calc(100vh - 69px)" }}>
          {/* Sidebar */}
          <div style={{ width: 240, borderRight: "1px solid #00d4ff11", padding: "16px", overflowY: "auto", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: "#445", letterSpacing: "0.2em", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>SAMPLE COMMANDS</div>
            {SAMPLE_COMMANDS.map((cmd, i) => (
              <button key={i} onClick={() => sendMessage(cmd)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", marginBottom: 6, background: "#0d1b2a", border: "1px solid #1a2a3a", borderRadius: 6, color: "#8899aa", cursor: "pointer", fontSize: 12, lineHeight: 1.4, transition: "all 0.15s" }}
                onMouseEnter={e => { e.target.style.borderColor = "#00d4ff55"; e.target.style.color = "#cde"; }}
                onMouseLeave={e => { e.target.style.borderColor = "#1a2a3a"; e.target.style.color = "#8899aa"; }}>
                {cmd}
              </button>
            ))}

            <div style={{ marginTop: 20, padding: "12px", background: "#0d1b2a", border: "1px solid #1a2a3a", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#445", letterSpacing: "0.15em", marginBottom: 8 }}>CAPABILITIES</div>
              {["🌤 Weather", "📅 Calendar", "⏰ Reminders", "🔍 Web Search", "🤖 AI Queries", "🎙 Voice (local)"].map(c => (
                <div key={c} style={{ fontSize: 12, color: "#667", padding: "3px 0", borderBottom: "1px solid #1a2a3a" }}>{c}</div>
              ))}
            </div>
          </div>

          {/* Main chat */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* API Key input */}
            {showKeyInput && (
              <div style={{ padding: "10px 16px", background: "#0a1628", borderBottom: "1px solid #00d4ff22", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#667", whiteSpace: "nowrap" }}>🔑 API Key:</span>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Enter your Anthropic API key to enable live responses..."
                  style={{ flex: 1, background: "#0d1b2a", border: "1px solid #00d4ff33", borderRadius: 6, padding: "6px 10px", color: "#cde", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}
                />
                {apiKey && <button onClick={() => setShowKeyInput(false)} style={{ padding: "5px 12px", background: "#00d4ff22", border: "1px solid #00d4ff", borderRadius: 5, color: "#00d4ff", cursor: "pointer", fontSize: 12 }}>✓ Set</button>}
              </div>
            )}
            {!showKeyInput && (
              <div style={{ padding: "6px 16px", background: "#001a0a", borderBottom: "1px solid #00ff8822", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#00cc66" }}>✅ API key set — live AI responses enabled</span>
                <button onClick={() => setShowKeyInput(true)} style={{ background: "none", border: "none", color: "#445", cursor: "pointer", fontSize: 11 }}>change</button>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((msg, i) => {
                const style = MESSAGE_COLORS[msg.role] || MESSAGE_COLORS.system;
                return (
                  <div key={i} style={{ animation: "fadeIn 0.3s ease", background: style.bg, border: `1px solid ${style.border}`, borderRadius: 10, padding: "12px 14px", maxWidth: msg.role === "user" ? "80%" : "100%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ fontSize: 10, color: msg.role === "user" ? "#4a9eff" : msg.role === "system" ? "#ff6b00" : "#00d4ff", letterSpacing: "0.2em", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>{style.label}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.65, color: "#c8d8e8", whiteSpace: "pre-wrap" }}>{msg.content}</div>
                  </div>
                );
              })}
              {loading && (
                <div style={{ animation: "fadeIn 0.3s ease", background: "#0d1b2a", border: "1px solid #00d4ff33", borderRadius: 10, padding: "12px 14px", maxWidth: 120 }}>
                  <div style={{ fontSize: 10, color: "#00d4ff", letterSpacing: "0.2em", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>PENUU</div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {[0, 1, 2].map(n => <div key={n} style={{ width: 7, height: 7, borderRadius: "50%", background: "#00d4ff", animation: `pulse 1.2s ease ${n * 0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #00d4ff11", background: "#050d1a" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: "#0d1b2a", border: "1px solid #00d4ff33", borderRadius: 10, padding: "8px 12px" }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a command or question... (Enter to send, Shift+Enter for newline)"
                  rows={1}
                  style={{ flex: 1, background: "transparent", border: "none", color: "#c8d8e8", fontSize: 14, resize: "none", fontFamily: "inherit", lineHeight: 1.5, maxHeight: 120, overflowY: "auto" }}
                />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ padding: "8px 16px", background: loading ? "#0d1b2a" : "linear-gradient(135deg, #00d4ff, #0080cc)", border: "none", borderRadius: 7, color: loading ? "#445" : "#000", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", transition: "all 0.2s" }}>
                  {loading ? "..." : "Send →"}
                </button>
              </div>
              <div style={{ fontSize: 11, color: "#334", textAlign: "center", marginTop: 6 }}>
                Powered by Claude · Simulates Penuu's command interface
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Files tab */
        <div style={{ display: "flex", height: "calc(100vh - 69px)" }}>
          {/* File list */}
          <div style={{ width: 200, borderRight: "1px solid #00d4ff11", padding: "12px 0", overflowY: "auto", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: "#445", letterSpacing: "0.2em", padding: "0 16px 10px", fontFamily: "'JetBrains Mono', monospace" }}>PROJECT FILES</div>
            {Object.keys(files).map(f => (
              <button key={f} onClick={() => setActiveFile(f)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 16px", background: activeFile === f ? "#00d4ff11" : "transparent", border: "none", borderLeft: `2px solid ${activeFile === f ? "#00d4ff" : "transparent"}`, color: activeFile === f ? "#00d4ff" : "#667", cursor: "pointer", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s" }}>
                {f.endsWith(".py") ? "🐍 " : f.endsWith(".txt") ? "📄 " : f.startsWith(".") ? "🔧 " : "📝 "}{f}
                {(f === "utils.py" || f === "google_calendar.py") && <span style={{ marginLeft: 6, fontSize: 9, color: "#7c3aed", background: "#7c3aed22", padding: "1px 5px", borderRadius: 3 }}>NEW</span>}
              </button>
            ))}
          </div>

          {/* Code viewer */}
          <div style={{ flex: 1, overflowY: "auto", background: "#0a1628" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #00d4ff11", display: "flex", alignItems: "center", gap: 8, background: "#050d1a" }}>
              <span style={{ fontSize: 13, color: "#00d4ff", fontFamily: "'JetBrains Mono', monospace" }}>{activeFile}</span>
              {(activeFile === "utils.py" || activeFile === "google_calendar.py") && (
                <span style={{ fontSize: 11, color: "#7c3aed", background: "#7c3aed22", padding: "2px 8px", borderRadius: 4 }}>✨ Added missing file</span>
              )}
            </div>
            <CodeBlock code={files[activeFile]} />
          </div>
        </div>
      )}
    </div>
  );
}
