import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const API_URL = "http://localhost:8000/api/chat";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();

    if (!text || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.message.content,
        },
      ]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Could not connect to the backend. Make sure FastAPI is running on port 8000.",
        },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([]);
    setInput("");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <button className="new-chat" onClick={newChat}>
          + New chat
        </button>
        <div className="sidebar-title">My AI</div>
        <div className="side-note">
          ChatGPT-style starter
          <br />
          React + FastAPI
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <strong>My AI</strong>
          <span>Chat</span>
        </header>

        <section className="chat">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="logo">AI</div>
              <h1>How can I help?</h1>
              <p>Ask something to test your ChatGPT-style application.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div className={`message-row ${message.role}`} key={index}>
                <div className="avatar">
                  {message.role === "user" ? "You" : "AI"}
                </div>
                <div className="message-content">{message.content}</div>
              </div>
            ))
          )}

          {loading && (
            <div className="message-row assistant">
              <div className="avatar">AI</div>
              <div className="message-content typing">Thinking...</div>
            </div>
          )}
        </section>

        <form className="composer" onSubmit={sendMessage}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message My AI..."
            rows={1}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(event);
              }
            }}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            ↑
          </button>
        </form>

        <footer className="footer">
          Starter application — connect a real model through the backend.
        </footer>
      </main>
    </div>
  );
}
