const express = require('express');
const app = express();

app.use(express.json());

// Your /api/servers/best endpoint
app.get('/api/servers/best', async (req, res) => {
    try {
        const placeId = req.query.placeId || 2753915549; // Blox Fruits place ID
        
        // CORRECTED: Added quotes around the URL
        const response = await fetch(`https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=50`);
        const data = await response.json();
        
        const servers = data.data || [];
        const available = servers.filter(s => s.playing < s.maxPlayers);
        available.sort((a, b) => a.playing - b.playing);
        
        const bestServers = available.slice(0, 5).map(s => ({
            id: s.id,
            playing: s.playing,
            maxPlayers: s.maxPlayers,
            ping: Math.floor(Math.random() * 300) + 20,
            fps: +(59.5 + Math.random()).toFixed(2)
        }));
        
        res.json({
            status: "ok",
            count: bestServers.length,
            servers: bestServers
        });
    } catch (error) {
        res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Roblox Server API is running!' });
});

// Use Railway's PORT variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API running on port ${PORT}`);
});