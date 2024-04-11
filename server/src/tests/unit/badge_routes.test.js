/* Unit tests for badge routes through using Ava */

import dotenv from 'dotenv';
dotenv.config();
import test from 'ava';
import supertest from 'supertest';
import express from 'express';
import badgeRouter from '../../routes/badges-routes.js';
import { SupabaseQueryClass } from '../../utils/databaseInterface.js';



// Initialise a supabase query class
const dbQuery = new SupabaseQueryClass();

// Set up an Express app instance
const app = express();
app.use(express.json());
app.use(badgeRouter);

app.use((req, res) => {
  req.dbQuery = dbQuery;
});

// Test route on getting the points needed for the next badge for a certain user
test.serial('GET /points_needed/:id returns points needed for next badge', async t => {
  const test_user_id = '238'; // ID of a test user
  const response = await supertest(app).get(`/points_needed/${test_user_id}`); // Send request
  console.log(`The response body for returns points needed for next badge is: ${JSON.stringify(response.body)}`) // Log the response's body
  t.is(response.status, 200); // Test whether response generates a status code 200
  t.deepEqual(response.body, { // Test whether the body of the response is produced as expected
    "Message": "Points to next badge",
    "pointsNeeded": 1000
  });
});

// Test route on getting the badge ID for a certain user
test.serial('GET /badge_id returns the badge ID for a given user', async t => {
  const test_user_id = '238'; // ID of a test user
  const response = await supertest(app).get(`/badge_id?id=${test_user_id}`); // Send request
  console.log(`The response body for return badge ID is: ${JSON.stringify(response.body)}`) // Log the response's body
  t.is(response.status, 200); // Test whether response generates a status code 200
  t.deepEqual(response.body, { // Test whether the body of the response is produced as expected
    "Message": "Selecting badge ID",
    "badge_id": 0
  });
});

// Test route on updating the points needed for the next badge for a certain user
test.serial('PUT /points_needed/:id resets points needed for the next badge', async t => {
  const test_user_id = '239'; // ID of a test user
  const response = await supertest(app).put(`/points_needed/${test_user_id}`); // Send request
  console.log(`The response body for updating points is: ${JSON.stringify(response.body)}`) // Log the response's body
  t.is(response.status, 200); // Test whether response generates a status code 200
  t.deepEqual(response.body, { // Test whether the body of the response is produced as expected
    "Message": "Points to next badge updated successfully",
    "Points": 1000,
    "data": null
  });
});
