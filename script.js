const N8N_WEBHOOK_URL = "https://abhishek111.app.n8n.cloud/webhook/b7fce85a-abca-459b-857f-9687c5ceb29d";

// Add event listener for Enter key
document.getElementById("userInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";
  
  // Add loading indicator
  const loadingId = appendLoadingIndicator();

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const text = await response.text();
    console.log("RAW response:", text);

    // Remove loading indicator
    removeLoadingIndicator(loadingId);

    let reply;
    try {
      const data = JSON.parse(text);
      reply = data.output || data.reply || data.response || data.message || data.data || "🤖 I didn't understand the response.";
      
      // Clean up the response
      reply = reply.replace(/\*\*/g, '') // Remove markdown bold
                  .replace(/\n/g, '<br>'); // Convert newlines to HTML
    } catch (e) {
      console.error("❌ Failed to parse JSON:", e);
      reply = "⚠️ Invalid response from server.";
    }

    appendMessage("bot", reply);

  } catch (err) {
    console.error("❌ Network error:", err);
    removeLoadingIndicator(loadingId);
    appendMessage("bot", "⚠️ Error connecting to server. Please try again.");
  }
}

function appendMessage(role, text) {
  const chatBox = document.getElementById("chatBox");
  if (!chatBox) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}-message`;
  
  const avatarDiv = document.createElement("div");
  avatarDiv.className = "message-avatar";
  
  if (role === "user") {
    avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
  } else {
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
  }
  
  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";
  contentDiv.innerHTML = text;
  
  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);
  
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendLoadingIndicator() {
  const chatBox = document.getElementById("chatBox");
  const id = "loading-" + Date.now();
  
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message bot-message";
  loadingDiv.id = id;
  
  const avatarDiv = document.createElement("div");
  avatarDiv.className = "message-avatar";
  avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
  
  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";
  contentDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  
  loadingDiv.appendChild(avatarDiv);
  loadingDiv.appendChild(contentDiv);
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  return id;
}

function removeLoadingIndicator(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}
