/* Integration tests for badge routes through using Ava */

import dotenv from 'dotenv';
dotenv.config();
import test from 'ava';
import request from 'supertest';
import express from 'express';
import badgeRouter from '../../routes/badges-routes.js';


// Set up an Express app instance
const app = express();
app.use(express.json());
app.use(badgeRouter);

// Test route on getting the points needed for the next badge for a certain user
test.serial('GET /points_needed/:id returns the points needed for the next badge', async t => {
    const test_user_id = '238'; // ID of a test user
    const response = await request(app).get(`/points_needed/${test_user_id}`); // Return response from route
    console.log(`The response body for getting points needed for integration test is: ${JSON.stringify(response.body)}`) // Log the response's body

    t.is(response.status, 200); // Test whether response generates a status code 200
    t.deepEqual(response.body, { // Test whether the body of the response is produced as expected
        "Message": "Points to next badge",
        "pointsNeeded": 1000
    })
});

// Test route on getting the badge ID for a certain user
test.serial('GET /badge_id returns the badge ID for a given user', async t => {
    const test_user_id = '238'; // ID of a test user
    const response = await request(app).get(`/badge_id?id=${test_user_id}`); // Return response from route
    console.log(`The response body for badge ID for integration test is: ${JSON.stringify(response.body)}`) // Log the response's body
    t.is(response.status, 200); // Test whether response generates a status code 200
    t.deepEqual(response.body, { // Test whether the body of the response is produced as expected
        "Message": "Selecting badge ID",
        "badge_id": 0, // The current badge ID
    });
});

// Test route on updating the points needed for the next badge for a certain user
test.serial('PUT /points_needed/:id resets points needed for the next badge', async t => {
    const test_user_id = '239'; // ID of a test user
    const response = await request(app).put(`/points_needed/${test_user_id}`); // Return response from route
    console.log(`The response body for updating points needed for next badge for integration test is: ${JSON.stringify(response.body)}`) // Log the response's body

    t.is(response.status, 200); // Test whether response generates a status code 200
    t.deepEqual(response.body, { // Test whether the body of the response is produced as expected
        "Message": "Points to next badge updated successfully",
        "Points": 1000, // The points to the next badge reset when user reaches next badge
        "data": null
    });
});

