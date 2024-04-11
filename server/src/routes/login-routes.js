/* For login routes */
import dotenv from 'dotenv';
dotenv.config();
import { Router } from 'express'
import bcrypt from 'bcrypt'
import supabase from '../utils/supabaseClient.js';
import { SupabaseQueryClass } from '../utils/databaseInterface.js';
import logger from '../middleware/logging.js';

const loginRouter = new Router()
const dbQuery = new SupabaseQueryClass()
/* Health check */
loginRouter.get('/health_check', (req, res) => {
    logger.info("Health Check Successful");
    return res.status(200).json({Status: "Health Check Successful"})
})

/* Inserts user details into database */
loginRouter.post('/sign_up', async (req, res) => {
    const { username, password, confirmPassword, email, firstname, lastname} = req.body
    // Checks if all input fields have been filled
    if (!username || !password || !confirmPassword || !email || !firstname || !lastname) {
        logger.warn("Sign up attempt with incomplete fields");
        return res.status(400).json({message: "All fields must be completed"})
    }
    // Handles case of passwords not matching
    if (password != confirmPassword) {
        logger.warn("Sign up attempt with non-matching passwords");
        return res.status(400).json({message: "Passwords do not match"})
    }

    const saltRounds = 5
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
        // Insert user data in database
        const result = await dbQuery.insert(supabase, 'users', {
            username: username,
            password: hashedPassword,
            email: email,
            firstname: firstname,
            lastname: lastname,
            badge_id: 0, 
            points_to_next_badge: 1000, 
            recent_topic: null})
        console.log(`Insertion result:  ${JSON.stringify(result)}`)
        if (result) {
            const { data, error } = result

            if (error) {
                console.log(`Error occurred:  ${JSON.stringify(error)}`)
                return res.status(400).json({message: "Sign up failed"})
            }
            else {
                logger.info("Sign up successful", { username: username });
                return res.status(200).json({message: "Sign up successful"})
                
            }
        } else {
            logger.error("Error occurred during sign up", { error: result.error });
            return res.status(400).json({message: "Sign up failed: "})
        }
    }
    
    catch (err) {
        logger.error("Error caught in inserting user data", { error: err });
        return res.status(400).json({message: "An error occurred during sign up"});
    }
    

})

/* Checks if user details are in database */
loginRouter.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) { // Checks whether input fields have been filled
        logger.warn("Login attempt with incomplete fields");
        return res.status(400).json({message: "All fields must be completed"})
    }

    try {
        const {data, error} = await dbQuery.selectWhere(supabase, 'users', 'username', username) // Looks for user details in database
        if (error) {
            logger.error("Database selection failed during login", { error });
            return res.status(400).json({ message: "Database selection failed: ", error})
        }
        else {
            const hashedPassword = data[0].password // Retrieves hashed password from user details
            const passwordMatch = await bcrypt.compare(password, hashedPassword); // Compares hashed password with inputted password

            if (passwordMatch) { // Handles case when passwords are the same
                logger.info("Login successful", { username });
                return res.status(200).json({message: "Login successful", "user_id": data[0].id})
            }
            else {// Handles case when passwords are not the same
                logger.warn(`Invalid login attempt ${JSON.stringify(username)}`);
                return res.status(400).json({message: "Invalid username or password"});
            }
        }
    }
    catch (err) {
        logger.error(`Error caught in login ${JSON.stringify(err)}`);
        return res.status(400).json({message: "An error occurred during login"});
    }

})

export default loginRouter;