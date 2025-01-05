const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/api/logs', (req, res) => {
    const username = req.body.username || 'default';
    const mode = req.body.mode || 'default';

    // Create logs directory if it doesn't exist
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    // Construct log file path
    const logFileName = path.join(logsDir, `${username}_${mode}_task_log.csv`);
    const logEntry = `${req.body.action1Name},${req.body.action2Name},${req.body.startTime},${req.body.endTime},${req.body.duration},${req.body.isCorrect},${req.body.accepted},${req.body.chosenMethod}\n`;

    if (!fs.existsSync(logFileName)) {
        fs.writeFileSync(logFileName, 'Action1Name,Action2Name,StartTime,EndTime,Duration,Correct,Accepted,Method\n');
    }

    fs.appendFileSync(logFileName, logEntry);
    res.status(200).send('Log saved');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));