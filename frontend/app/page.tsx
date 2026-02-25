import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LandingPage = () => {
    const [bitcoinPrice, setBitcoinPrice] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchBitcoinPrice = async () => {
            const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
            const data = await response.json();
            setBitcoinPrice(data.bpi.USD.rate_float);
        };

        const fetchChartData = async () => {
            const response = await fetch('https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday');
            const data = await response.json();
            const formattedData = Object.keys(data.bpi).map(date => ({ date, price: data.bpi[date] }));
            setChartData(formattedData);
        };

        fetchBitcoinPrice();
        fetchChartData();
    }, []);

    return (
        <div>
            <header>
                <h1>Bitcoin Price Tracker</h1>
                <p>Track the current price of Bitcoin and view historical trends.</p>
            </header>
            <div className="price-card">
                <h2>Current Bitcoin Price</h2>
                {bitcoinPrice ? <h3>${bitcoinPrice.toFixed(2)}</h3> : <p>Loading...</p>}
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LandingPage;
