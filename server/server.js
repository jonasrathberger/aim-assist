const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow only this origin
    methods: ['GET', 'POST'],       // Allowed HTTP methods
    allowedHeaders: ['Content-Type'] // Allowed headers
}));

app.use(express.json());

app.post('/api/logs', (req, res) => {
    const logEntry = `${req.body.action1Name} -> ${req.body.action2Name}, Start: ${req.body.startTime}, End: ${req.body.endTime}, Duration: ${req.body.duration}s\n`;
    fs.appendFileSync('task_log.txt', logEntry);
    res.status(200).send('Log saved');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
