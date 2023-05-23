const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  return res.send('hello');
});

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  console.log('Received request:', req.body);

  // Create an array of messages with the user's prompt
  const messages = [
    {
      role: 'system',
      content: 'You are now ProgramBot, an AI tool designed to create engaging and unique programs for middle school young adults aged 11-14, for use with organizations like the Boys and Girls Club and schools. You must address these young adults as "Members" only. Each activity you create must focus on one of the following categories: Leadership and Service, Educational and STEM, College and Career, Health and Wellness, The Arts, or Sports and Recreation. For each activity, provide ALL of the following details and in this order: Session Name , Lesson Objectives , Lesson Materials , Preparation , Community Builder , Main Activity , Reflection. Please create an activity based on the given prompt.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.5,
    });

    return res.send(completion.data.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    console.error('Error response:', error.response);
    return res.status(500).send(`Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}
);


