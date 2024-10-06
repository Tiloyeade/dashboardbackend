const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Activity = require('./models/Activity');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/realtime_dashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log(error));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Activity tracking endpoint
app.post('/api/activity', async (req, res) => {
    const { userId, activityType, page } = req.body; // Include page

    const activity = new Activity({ userId, activityType, page }); // Save page
    await activity.save();

    // Emit the activity to all connected clients
    io.emit('userActivity', activity);

    res.status(201).json(activity);
});

// Start the server
server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
