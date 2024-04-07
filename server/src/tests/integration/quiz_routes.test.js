/* Integration tests for quiz routes through using Ava */

import dotenv from 'dotenv';
dotenv.config();

import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import express from 'express';
import quizRouter from '../../routes/quiz-routes.js';
import { SupabaseQueryClass } from '../../utils/databaseInterface.js';


// Mock the SupabaseQueryClass with a stub instance
const dbQueryMock = sinon.createStubInstance(SupabaseQueryClass);

const app = express();
app.use(express.json());
app.use(quizRouter);

// Mock dependencies injection
app.use((req, res, next) => {
  req.dbQuery = dbQueryMock;
  next();
});

// Test route on getting a random question
test.serial('GET /questions returns random question', async t => {
    // Receive response for request
    const response = await supertest(app).get('/questions');

    // Assertions
    t.is(response.status, 200); // Test whether response generates a status code 200
    t.truthy(response.body.question.id); // Check if the question has an ID
    t.truthy(response.body.question.question_content); // Check if the question has a content field
    t.truthy(response.body.question.question_name); // Check if the question has a name field
    t.truthy(response.body.question.option_one); // Check if the question has an option one field
    t.truthy(response.body.question.option_two); // Check if the question has an option two field
    t.truthy(response.body.question.option_three); // Check if the question has an option three field
    t.truthy(response.body.question.option_four); // Check if the question has an option four field
    t.truthy(response.body.question.answer); // Check if the question has an answer field

});
