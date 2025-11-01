/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* Conversation history - maintain context across turns */
let conversationHistory = [
  {
    role: "system",
    content:
      "You are a helpful L'Oréal beauty advisor. Your role is to assist customers with questions about L'Oréal products, skincare routines, makeup recommendations, hair care advice, and beauty tips. You should only answer questions related to L'Oréal products, beauty, skincare, makeup, and hair care. If someone asks about topics unrelated to L'Oréal or beauty (such as politics, sports, general knowledge, etc.), politely redirect them by saying something like: 'I'm here to help with L'Oréal products and beauty advice. How can I assist you with your beauty routine today?' Always be friendly, professional, and knowledgeable about beauty products and routines.",
  },
];

/* Set initial welcome message */
displayMessage(
  "ai",
  "👋 Hello! I'm your L'Oréal Beauty Advisor. How can I help you with your beauty routine today?"
);

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  // Display user's question
  displayMessage("user", question);

  // Clear input
  userInput.value = "";

  // Disable form while waiting
  userInput.disabled = true;
  const sendBtn = document.getElementById("sendBtn");
  sendBtn.disabled = true;

  // Add user message to conversation history
  conversationHistory.push({
    role: "user",
    content: question,
  });

  try {
    // ===== OPTION 1: Direct OpenAI API (for local testing) =====
    // Use this for local testing with secrets.js
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: conversationHistory,
        max_tokens: 300,
      }),
    });

    // ===== OPTION 2: Cloudflare Worker (SECURE - use this for production) =====
    // Uncomment this section when you've deployed your Cloudflare Worker
    // Remember to comment out OPTION 1 above when using this
    /*
    const CLOUDFLARE_WORKER_URL = "YOUR_CLOUDFLARE_WORKER_URL";

    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: conversationHistory,
      }),
    });
    */

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const aiResponse = data.choices[0].message.content;

      // Add AI response to conversation history
      conversationHistory.push({
        role: "assistant",
        content: aiResponse,
      });

      // Display AI response
      displayMessage("ai", aiResponse);
    } else {
      displayMessage(
        "ai",
        "Sorry, I couldn't process your request. Please try again."
      );
    }
  } catch (error) {
    console.error("Error:", error);
    displayMessage(
      "ai",
      "Sorry, there was an error connecting to the service. Please try again."
    );
  } finally {
    // Re-enable form
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
});

/* Display message in chat window */
function displayMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `msg ${sender}`;
  messageDiv.textContent = text;
  chatWindow.appendChild(messageDiv);

  // Scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
