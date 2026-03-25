import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "https://ai-cover-letter-5meq.onrender.com";

const UPCOMING_FEATURES = [
  "Tone selector (formal, friendly, executive)",
  "Keyword match score with missing skills checklist",
  "Company research snippets and culture highlights",
  "Export to PDF/DOCX with branded templates",
  "Save versions, compare revisions, and restore",
  "Portfolio and LinkedIn summary generator",
  "Interview follow-up email templates",
  "Application tracker with reminders"
];

function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "bot", text: "Hi! Ask me anything about cover letters." }
  ]);

  const uploadResume = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/upload-resume`, formData);
      setUploaded(true);
    } catch (error) {
      setUploaded(false);
      alert("Upload failed. Please try again.");
    }
  };

  const generateLetter = async () => {
    if (!jobDescription) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("job_description", jobDescription);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/generate-cover-letter`,
        formData
      );
      setCoverLetter(res.data.cover_letter);
    } catch (error) {
      alert("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    alert("Copied");
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", text: chatInput.trim() };
    const botMessage = { role: "bot", text: "Under Creation" };
    const featuresMessage = {
      role: "bot",
      text:
        "Upcoming features: " + UPCOMING_FEATURES.join(" • ")
    };

    setChatMessages((prev) => [
      ...prev,
      userMessage,
      botMessage,
      featuresMessage
    ]);
    setChatInput("");
  };

  const handleChatKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleChatSend();
    }
  };

  return (
    <div className="page">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <header className="hero">
        <span className="pill">AI POWERED</span>
        <h1>AI Cover Letter Generator</h1>
        <p className="subtitle">
          Generate personalized, ATS-friendly cover letters in seconds.
        </p>
        <p className="trust">
          No signup required | Instant generation | Free tool
        </p>
        <div className="badge-row">
          <span className="badge">ATS-friendly</span>
          <span className="badge">Fast turnaround</span>
          <span className="badge">Pro templates</span>
        </div>
      </header>

      <main className="layout">
        <section className="panel main-panel">
          <div className="card steps-card">
            <h3>How it works</h3>
            <ol className="steps">
              <li>Upload your resume</li>
              <li>Paste the job description</li>
              <li>Generate the cover letter</li>
              <li>Copy and apply</li>
            </ol>
          </div>

          <div className="card upload-card">
            <div className="card-header">
              <h3>Upload Resume</h3>
              <span className="helper">PDF or DOCX</span>
            </div>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(event) => uploadResume(event.target.files[0])}
            />
            {uploaded && (
              <p className="status success">
                Resume uploaded successfully.
              </p>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Job Description</h3>
              <span className="helper">Paste the role details</span>
            </div>
            <textarea
              rows="7"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
            <button className="primary-button" onClick={generateLetter}>
              {loading ? "Generating..." : "Generate Cover Letter"}
            </button>
          </div>

          {coverLetter && (
            <div className="card result-card">
              <div className="card-header">
                <h3>Cover Letter</h3>
                <button className="ghost-button" onClick={copyText}>
                  Copy
                </button>
              </div>
              <textarea value={coverLetter} readOnly rows="12" />
            </div>
          )}
        </section>

        <aside className="panel side-panel">
          <div className="card features-card">
            <div className="card-header">
              <h3>Upcoming Features</h3>
              <span className="helper">Coming soon</span>
            </div>
            <ul className="feature-list">
              {UPCOMING_FEATURES.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      <div className={`chat-shell ${chatOpen ? "open" : ""}`}>
        <button
          className="chat-fab"
          onClick={() => setChatOpen((prev) => !prev)}
          aria-label="Open chat"
        >
          {chatOpen ? "×" : "Chat"}
        </button>

        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <h4>Live Chat</h4>
              <span>We respond instantly</span>
            </div>
          </div>
          <div className="chat-window">
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-bubble ${message.role}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <textarea
              rows="2"
              placeholder="Ask about cover letter tips..."
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={handleChatKeyDown}
            />
            <button className="primary-button" onClick={handleChatSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
