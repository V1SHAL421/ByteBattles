/* Integration tests for login routes through using Ava */

import dotenv from 'dotenv';
dotenv.config();
import test from 'ava';
import request from 'supertest';
import express from 'express';
import loginRouter from '../../routes/login-routes.js';
import sinon from 'sinon'; 
import bcrypt from 'bcrypt';
import { SupabaseQueryClass } from '../../utils/databaseInterface.js';


// Set up an Express app instance
const app = express();
app.use(express.json());
app.use('/', loginRouter);

// Mock database interactions and stub bcrypt functions using sinon
const dbQueryMock = sinon.mock(SupabaseQueryClass.prototype);
const bcryptHashStub = sinon.stub(bcrypt, 'hash');
const bcryptCompareStub = sinon.stub(bcrypt, 'compare');

// Reset mocks and stubs
test.beforeEach(() => {
    dbQueryMock.restore();
    bcryptHashStub.reset();
    bcryptCompareStub.reset();
});

// Clean up mocks/stubs
test.after.always(() => {
    dbQueryMock.restore();
    bcryptHashStub.restore();
    bcryptCompareStub.restore();
});

// Test route to perform a health check
test.serial('Health check should return 200 with success message', async t => {
    const response = await request(app).get('/health_check');
    t.is(response.status, 200); // Test whether response generates a status code 200
});

// Test route on signing up with incomplete fields
test.serial('Sign up with incomplete fields should return 400', async t => {
    const response = await request(app).post('/sign_up').send({
        username: 'testUser'
        // Other fields are not inputted
    });
    t.is(response.status, 400); 
    t.deepEqual(response.body, { // Test whether the body of the response is produced as expected
        "message": "All fields must be completed"
    })
});

// Test route on logging in with incomplete fields
test.serial('Login with incomplete fields returns 400', async t => {
    const response = await request(app).post('/login').send({
        username: 'testUser'
        // No password
    });
    t.is(response.status, 400);
    t.deepEqual(response.body, { // Test whether the body of the response is produced as expected
        "message": "All fields must be completed"
    })
});

// Test route on logging in succesfully
test.serial('Successful login returns 200 with user_id', async t => {
    const testUser = { id: 1, username: 'testUser', password: 'hashedPassword' }; // Create a test user
    dbQueryMock.expects('selectWhere').once().returns(Promise.resolve({ data: [testUser], error: null }));
    bcryptCompareStub.returns(Promise.resolve(true));

    const response = await request(app).post('/login').send({ // Post these parameters for the route
        username: 'testUser',
        password: 'correctPassword'
    });

    t.is(response.status, 200); // Test whether response generates a status code 200
    t.truthy(response.body.user_id);

    // Verify that the mock is used as it should be
    dbQueryMock.verify();
    sinon.assert.calledOnce(bcryptCompareStub);
});
