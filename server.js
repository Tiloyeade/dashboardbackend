const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Activity = require('./models/Activity');
const helmet = require('helmet');
const simulateActivities = require('./simulateActivities'); // Import the simulateActivities script

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Set up Content Security Policy
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://static.cloudflareinsights.com"],
    },
}));

// MongoDB connection settings
const uri = "mongodb+srv://abey:festus@cluster2.sjib7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// MongoDB connection function
async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Call the connection function
run().catch(console.dir);

// Root route (fixes 404 error)
app.get('/', (req, res) => {
    res.send('Welcome to the Real-Time Dashboard API!');
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Activity tracking endpoint
app.post('/api/activity', async (req, res) => {
    const { userId, activityType, page } = req.body;

    const activity = new Activity({ userId, activityType, page });
    await activity.save();

    io.emit('userActivity', activity);

    res.status(201).json(activity);
});

// Start simulating activities when the server starts
simulateActivities(); // Call simulateActivities to start the simulation

// Start the server
server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
