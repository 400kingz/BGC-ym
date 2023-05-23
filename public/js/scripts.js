const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById("chatInput");
const cardsTable = document.getElementById("cardsTable");

const createCard = (title, content) => {
  return `<div class="card">
    <h3>${title}</h3>
    <p>${content}</p>
  </div>`;
};

const parseResponse = (response) => {
  const lines = response.split("\n");
  let sections = [];
  let currentSection = { title: "", content: "" };
  let sessionNameFound = false;

  lines.forEach((line) => {
    if (line) {
      if (!sessionNameFound) {
        currentSection.title = line;
        sessionNameFound = true;
      } else if (line.endsWith(":")) {
        if (currentSection.title) {
          sections.push(currentSection);
        }
        currentSection = { title: line, content: "" };
      } else {
        currentSection.content += (currentSection.content ? "<br>" : "") + line;
      }
    }
  });

  if (currentSection.title) {
    sections.push(currentSection);
  }

  return sections;
};

async function sendMessage(prompt) {
  try {
    const loading = document.getElementById("loading");
    loading.style.display = "block"; // Show the loading animation

    const response = await axios.post("/chat", { prompt });
    const sections = parseResponse(response.data);

    loading.style.display = "none"; // Hide the loading animation

    displayProgram(sections);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}



sendButton.addEventListener("click", async () => {
  const prompt = chatInput.value;

  if (!prompt) {
    return;
  }

  // Display user input
  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.innerHTML = prompt;
  messages.appendChild(userMessage);

  try {
    const response = await axios
    .post('/chat', {
      prompt: prompt,
    });

    

    const generatedResponse = response.data.trim();
    const sections = parseResponse(generatedResponse);

    let cards = "";

    sections.forEach((section) => {
      cards += createCard(section.title, section.content);
    });

    // Display bot response
    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    botMessage.innerHTML = `<div class="cards-container">${cards}</div>`;
    messages.appendChild(botMessage);

    // Scroll to the bottom of the messages container
    messages.scrollTop = messages.scrollHeight;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }

  chatInput.value = "";
});
