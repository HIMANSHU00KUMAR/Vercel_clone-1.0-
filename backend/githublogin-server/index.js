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

const CLIENT_ID = 'Ov23liRF2DZxKXgwErs3';
const CLIENT_SECRET = '888e4980263f6d627ac061b1926963d76799554f';

app.post('/auth/github/callback', async (req, res) => {
    const { code } = req.body;

    try {
        const tokenResponse = await axios.post(
          'https://github.com/login/oauth/access_token',
          {
            client_id:CLIENT_ID,
            client_secret:CLIENT_SECRET,
            code,
          },
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );
    
        res.json({ access_token: tokenResponse.data.access_token });
      } catch (error) {
        res.status(500).json({ error: 'Failed to exchange code for access token' });
      }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});