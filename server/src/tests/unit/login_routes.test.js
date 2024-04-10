/* Unit tests for login routes through using Ava */

import dotenv from 'dotenv';
dotenv.config();
import test from 'ava';
import sinon from 'sinon';
import express from 'express';
import bcrypt from 'bcrypt';
import supertest from 'supertest';
import loginRouter from '../../routes/login-routes.js';
import { SupabaseQueryClass } from '../../utils/databaseInterface.js';



// Mock bcrypt.hash
sinon.stub(bcrypt, 'hash').resolves('hashedPassword');


test.beforeEach(() => {

  sinon.restore();
});

// Test route on signing up succesfully
test.serial('POST /sign_up - success scenario', async t => {
  const app = express();
  app.use(express.json());
  app.use(loginRouter);

  const request = supertest(app);

  const response = await request.post('/sign_up').send({
    username: 'testUser',
    password: 'password',
    confirmPassword: 'password',
    email: 'test@test.com',
    firstname: 'Test',
    lastname: 'User'
  });

  console.log(`The response for signing a user up is: ${JSON.stringify(response)}`)

  t.is(response.status, 200); // Test whether response generates a status code 200
  t.deepEqual(response.body, {
    "message": "Sign up successful" // Test whether the body of the response is produced as expected message: 'Sign up successful' });
})
});
