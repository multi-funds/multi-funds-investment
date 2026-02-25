import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Fetch current Bitcoin market data
router.get('/market-data', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch market data' });
    }
});

// Fetch historical Bitcoin market data
router.get('/historical-data', async (req, res) => {
    const { days } = req.query; // number of days for historical data
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch historical data' });
    }
});

export default router;
