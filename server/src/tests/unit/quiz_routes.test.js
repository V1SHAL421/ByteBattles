/* Unit tests for quiz routes through using Ava */

import dotenv from 'dotenv';
dotenv.config();
import test from 'ava';
import supertest from 'supertest';
import express from 'express';
import sinon from 'sinon';
import supabase from '../../utils/supabaseClient.js';
import { SupabaseQueryClass } from '../../utils/databaseInterface.js';
import quizRouter from '../../routes/quiz-routes.js';



// Initialise a supabase query class
const dbQuery = new SupabaseQueryClass();

// Set up an Express app instance
const app = express();
app.use(express.json());
app.use(quizRouter);

app.use((req, res) => {
  req.dbQuery = dbQuery;
});

// Test route on getting a random question
test.serial('GET /questions returns random question', async t => {

  const response = await supertest(app).get('/questions'); // Send request
  console.log(`Response from unit test of quiz routes is: ${JSON.stringify(response)}`)

  t.is(response.status, 200); // Test whether response generates a status code 200
  t.truthy(response.body.question.id); // Check if the question has an ID
  t.truthy(response.body.question.question_content); // Check if the question has a question field
  t.truthy(response.body.question.question_name); // Check if the question has a question name field
  t.truthy(response.body.question.option_one); // Check if the question has an option one field
  t.truthy(response.body.question.option_two); // Check if the question has an option two field
  t.truthy(response.body.question.option_three); // Check if the question has an option three field
  t.truthy(response.body.question.option_four); // Check if the question has an option four field
  t.truthy(response.body.question.answer); // Check if the question has an answer field
});

// Test route on posting the correct answer to a question for a certain user
test.serial('POST /questions/quiz/:questionName/:user_id handles correct answer', async t => {
  const test_user_id = '239'; // ID of a test user

  const question_name = 'PaaS';
  const selected_option = 4;
  const question = { id: 1, question_name: question_name, answer: selected_option };
  const user = { id: test_user_id, points_to_next_badge: 100 };


  sinon.stub(dbQuery, 'selectWhere')
    .withArgs(supabase, 'questions', 'question_name', question_name)
    .resolves({ data: [question], error: null })
    .withArgs(supabase, 'users', 'id', test_user_id)
    .resolves({ data: [user], error: null });

  sinon.stub(dbQuery, 'update').resolves({ data: {}, error: null });


  const response = await supertest(app)
    .post(`/questions/quiz/${question_name}/${test_user_id}`)
    .send({ selected_option });
  
  console.log(`The response body for handling the correct answer is: ${JSON.stringify(response.body)}`) // Log the response's body

  t.is(response.status, 200); // Test whether response generates a status code 200
  t.true(response.body.Message.includes('Correct'));
  t.true('points_reduced' in response.body);
});
