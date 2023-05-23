const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Set up OpenAI configuration
const configuration = new Configuration({
  organization: 'org-POwYe8cvtR3ywvUJenzumikx',
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.Completion.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const { choices } = response;
    const assistantReply = choices[0].message.content;

    res.json({ message: assistantReply });
  } catch (error) {
    console.error('Failed to fetch chat response:', error);
    res.status(500).json({ error: 'Failed to fetch chat response' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
