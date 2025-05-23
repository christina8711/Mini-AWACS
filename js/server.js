require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const port = 3000;

// Import Twilio SDK
const twilio = require('twilio');

// Get Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Get recipient phone numbers from environment variables
const recipientPhoneNumbers = process.env.RECIPIENT_PHONE_NUMBERS.split(',');

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Function to generate random radar data
function generateRandomRadarData() {
    const numberOfObjects = Math.floor(Math.random() * 10) + 1; // Random number of objects (1 to 10)
    const radarData = [];

    for (let i = 0; i < numberOfObjects; i++) {
        radarData.push({
            id: i + 1,
            distance: Math.floor(Math.random() * 180) + 20, // Random distance (20 to 200)
            angle: Math.floor(Math.random() * 360), // Random angle (0 to 359)
            direction: Math.floor(Math.random() * 360), // Random direction (0 to 359)
            speed: Math.floor(Math.random() * 500) + 100, // Random speed (100 to 600)
            altitude: Math.floor(Math.random() * 10000) + 1000 // Random altitude (1000 to 11000)
        });
    }

    return radarData;
}

// Endpoint to get radar data
app.get('/radar-data', (req, res) => {
    const radarData = generateRandomRadarData();
    res.json(radarData);

    // Send radar data as an SMS
    // sendSMS(radarData);
});

// Function to send SMS using Twilio
function sendSMS(data) {
    // Format the radar data as a string
    const messageBody = JSON.stringify(data, null, 2);

    // Send SMS to each phone number
    recipientPhoneNumbers.forEach(phoneNumber => {
        client.messages
            .create({
                body: `Radar Data:\n${messageBody}`,
                from: twilioPhoneNumber,
                to: phoneNumber
            })
            .then(message => console.log(`SMS sent to ${phoneNumber}. Message SID: ${message.sid}`))
            .catch(error => console.error(`Error sending SMS to ${phoneNumber}:`, error));
    });
}

// Serve static files from the "public" directory
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
