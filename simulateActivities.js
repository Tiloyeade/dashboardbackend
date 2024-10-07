const axios = require('axios');

const activities = ['login', 'logout', 'pageVisit'];
const users = ['user123', 'user456', 'user789', 'user101', 'user202'];
const pages = ['home', 'dashboard', 'profile', 'settings'];

function getRandomActivity() {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const randomPage = pages[Math.floor(Math.random() * pages.length)];

    return {
        userId: randomUser,
        activityType: randomActivity,
        page: randomActivity === 'pageVisit' ? randomPage : null,
    };
}

function simulateActivity() {
    const activity = getRandomActivity();
    console.log('Simulating activity:', activity); // Log the simulated activity

    axios.post('http://localhost:4000/api/activity', activity)
        .then((response) => {
            console.log(`Activity logged: ${response.data.userId} - ${response.data.activityType} on ${response.data.page || ''}`);
        })
        .catch((error) => {
            console.error('Error logging activity:', error);
        });
}

// Simulate activity every 3 seconds
setInterval(simulateActivity, 30000);
