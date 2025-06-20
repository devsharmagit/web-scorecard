import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import { getSeoData } from './controllers/seo';
import { runSecurityCheck } from './controllers/security';
import session from 'express-session';
import { getLeadData } from './controllers/lead';
import { getWebsiteMetrics } from './controllers/traffic';


const app = express();
app.use(cors());
app.use(express.json());
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));

// healt check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/getSEOData', async (req, res) => {

    const url = req.query.url as string;
    if (!url) {
        res.status(400).json({ error: 'URL is required' });
        return 
    }   

    const data = await getSeoData(url);

    res.status(200).json({
        status: 'success',
        data: data,
        message: 'SEO data fetched successfully'
    });


})

app.post('/security', runSecurityCheck)
app.post('/lead', getLeadData)
app.post('/traffic', async (req, res) => {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: 'URL is required' });
        return
    } 
  const data = await getWebsiteMetrics(url);
  res.status(200).json({
    status: 'success',
    data: data,
    message: 'Traffic data fetched successfully'
  
  })
})

const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});