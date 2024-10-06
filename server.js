const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Activity = require('./models/Activity');
const helmet = require('helmet');
const simulateActivities = require('./simulateActivities'); // Import simulateActivities.js

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet()); // Use helmet for setting security headers

// Set up Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Allow resources only from the same origin
      scriptSrc: ["'self'", 'https://static.cloudflareinsights.com'], // Allow scripts from your origin and Cloudflare
      // You can add more directives based on your app's needs
    },
  })
);

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://<adegoroyeadetiloye>:<abey11111>@cluster2.sjib7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2 ', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

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

  // Emit the activity to all connected clients
  io.emit('userActivity', activity);

  res.status(201).json(activity);
});

// Start the server
server.listen(4000, () => {
  console.log('Server is running on port 4000');

  // Start simulating activities when the server starts
  simulateActivities(); // This will start the activity simulation
});
