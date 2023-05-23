const express = require('express');
const app = express();
const axios = require('axios');
const { promisify } = require('util');
const cache = require('memory-cache');
const bodyParser = require('body-parser');

// Set up a rate limiter
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10 // limit each IP to 10 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

// Set up body parser for parsing JSON
app.use(bodyParser.json());
app.use(express.static('public'));


app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  
  // Check the cache first
  const cachedResponse = cache.get(prompt);
  if (cachedResponse) {
    return res.send(cachedResponse);
  }
  
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      max_tokens: 1500,
      temperature: 0.5,
      prompt: prompt
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Cache the response
    cache.put(prompt, response.data, 60 * 1000);  // Cache for 1 minute
    
    res.send(response.data);
  } catch (error) {
    console.error(`Failed to fetch chat response: ${error}`);
    res.status(500).send('Failed to fetch chat response');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
