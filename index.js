const express = require('express');
const app = express();

app.get('/api/servers/best', async (req, res) => {
    try {
        const placeId = req.query.placeId || 2753915549;
        
        // Fetch from Roblox API
        const response = await fetch(`https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=50`);
        const data = await response.json();
        
        // Get servers array
        let allServers = [];
        if (data && data.data) {
            allServers = data.data;
        }
        
        // Filter for servers with available slots
        const available = allServers.filter(server => {
            return server.playing < server.maxPlayers;
        });
        
        // Return the servers
        res.json({
            status: "ok",
            count: available.length,
            servers: available.map(server => ({
                id: server.id,
                playing: server.playing,
                maxPlayers: server.maxPlayers
            }))
        });
        
    } catch (error) {
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