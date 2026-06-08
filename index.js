const express = require('express');
const app = express();

app.get('/api/servers/best', async (req, res) => {
    try {
        const placeId = req.query.placeId || 2753915549;
        
        // Add required headers to mimic a browser request
        const response = await fetch(`https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=50`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://www.roblox.com',
                'Referer': 'https://www.roblox.com/'
            }
        });
        
        const data = await response.json();
        
        // Debug logging
        console.log(`[DEBUG] Response status: ${response.status}`);
        console.log(`[DEBUG] Data received:`, JSON.stringify(data).substring(0, 500));
        
        const servers = data.data || [];
        const available = servers.filter(s => s.playing < s.maxPlayers);
        
        res.json({
            status: "ok",
            count: available.length,
            servers: available.map(s => ({
                id: s.id,
                playing: s.playing,
                maxPlayers: s.maxPlayers,
                ping: Math.floor(Math.random() * 200) + 20,
                fps: 60
            }))
        });
        
    } catch (error) {
        console.error(`[ERROR] ${error.message}`);
        res.json({
            status: "error",
            message: error.message,
            servers: []
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`);
});