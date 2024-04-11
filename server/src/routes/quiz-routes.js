import dotenv from 'dotenv';
dotenv.config();

import { Router } from "express";
import { SupabaseQueryClass } from "../utils/databaseInterface.js";
import supabase from "../utils/supabaseClient.js";

const quizRouter = new Router()
const dbQuery = new SupabaseQueryClass()

/* Retrieves a random question from the database */
quizRouter.get("/questions", async (req, res) => {
    const { user_id } = req.query; // Retrieves user ID

    try {
        const { data, error } = await supabase
          .rpc('get_random_question'); // Gets random question from defined SQL function
      
        if (error) {
            return res.status(400).json({"Error": "Error in selecting data", error});
        } else {
            console.log(`Selecting data: ${JSON.stringify(data)}`);
            return res.status(200).json({ message: "Selecting random question names: ", "question": data[0], "user_id": user_id});
        }
    } catch (err) {
        return res.status(400).json({ message: "Error caught in selecting data", err });
    }
});

/* Handles question answering */
quizRouter.post("/questions/quiz/:questionName/:user_id", async (req, res) => {
    const { questionName, user_id } = req.params; // Retrieves question name and user ID
    const { selected_option } = req.body; // Retrieves selected option

    try {
        // Fetch the question to get the correct answer
        const question_response = await dbQuery.selectWhere(supabase, "questions", "question_name", questionName); // Retrieve details of question
        if (question_response.error) {
            return res.status(404).json({"Message": "Question not found"});
        }

        const question = question_response.data[0]; // Retrieves answer for question
        const is_correct = question.answer === selected_option; // Compares answer with selected option
        console.log(`The answer is ${{is_correct}}, the answer given is ${question.answer} and the selected option is ${selected_option}`)

        // Fetch the user to update their points/badge
        const user_response = await dbQuery.selectWhere(supabase, "users", "id", user_id); // Retrieves user details
        if (user_response.error) {
            return res.status(404).json({"Message": "User not found"});
        }

        let user = user_response.data[0]; // Puts user details in user variable
        if (is_correct) {

            let new_points = Math.max(0, user.points_to_next_badge - 100); // Ensures new points does not become negative
            console.log(`Updating points to: ${new_points}`);
            const updateResponse = await dbQuery.update(supabase, "users", "id", user_id, "points_to_next_badge", new_points); // Updates the number of points to the next badge
            if (updateResponse.error) {
                return res.status(400).json({"Error": "Error updating user progress"});
            }

            return res.status(200).json({
                "Message": "Correct answer",
                "points_reduced": user.points_to_next_badge - new_points,
                "nextBadge": new_points,
            });
        } else {
            return res.status(200).json({"Message": "Incorrect answer", "correctAnswer": question.answer});
        }
    } catch (err) {
        console.error("Error caught in processing quiz answer:", err);
        return res.status(500).json({ "Message": "Internal server error", err });
    }
});

export default quizRouter;