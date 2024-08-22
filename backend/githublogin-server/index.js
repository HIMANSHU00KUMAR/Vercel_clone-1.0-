import express from 'express'
import fetch from 'node-fetch'
import bodyParser from 'body-parser'
import axios from 'axios';
import cors from 'cors'
import dotenv from 'dotenv';


dotenv.config()


const app = express();
app.use(bodyParser.json());
app.use(cors())

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.post('/auth/github/callback', async (req, res) => {
  const { code } = req.body;

  try {
    // Step 1: Exchange the code for an access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: 'Failed to obtain access token' });
    }

    // Step 2: Fetch the authenticated user's info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Step 3: Send the user info and access token back to the frontend
    res.json({ user: userResponse.data, access_token: accessToken });
  } catch (error) {
    console.error('Error fetching user info:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});