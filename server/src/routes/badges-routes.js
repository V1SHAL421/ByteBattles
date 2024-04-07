import dotenv from 'dotenv';
dotenv.config();
import { Router } from "express";
import { SupabaseQueryClass } from "../utils/databaseInterface.js";
import supabase from "../utils/supabaseClient.js";

const badgeRouter = new Router()
const dbQuery = new SupabaseQueryClass()

/* Retrieves the points needed for the user to achieve the next badge */
badgeRouter.get("/points_needed/:id", async(req, res, next) => {
    const { id } = req.params; // Retrieve user ID

    try {
        const { data, error } = await dbQuery.selectWhere(supabase, "users", "id", id); // Retrieve user details from database
        if (error) {
            console.log("Error in selecting data");
            return res.status(400).json({"Error": "Error in selecting data: ", error});
        } else {
            console.log(`Selecting data: ${JSON.stringify(data)}`);
            const pointsToNextBadge = data[0].points_to_next_badge; // Retrieves the user's number of points to the next badge
            return res.status(200).json({"Message": "Points to next badge", "pointsNeeded": pointsToNextBadge});
        }
    } catch (err) {
        console.log("Error caught in selecting data: ", err);
        return res.status(400).json({ message: "Error caught in selecting data"});
    }
});

/* Retrieves the user's current badge ID */
badgeRouter.get("/badge_id", async(req, res, next) => {

    const {id} = req.query

    try {
        const { data, error } = await dbQuery.selectWhere(supabase, "users", "id", id) // Retrieve user details from database
        if (error) {
            console.log("Error in selecting column")
            return res.status(400).json({"Error": "Error in selecting data: ", error})
        }
        else {
            const user = data[0];
            console.log(`Selecting data: ${JSON.stringify(user)}`);
            console.log(`The badge id is ${user.badge_id}`); // Retrieves the user's badge ID
            return res.status(200).json({"Message": "Selecting badge ID", "badge_id": user.badge_id});
        }
        
    } catch (err) {
        console.log("Error caught in selecting data: ", err)
        return res.status(400).json({ message: "Error caught in selecting data"})
    }
})

/* Updates the user's badge ID */
badgeRouter.put("/badge_id/:id", async (req, res, next) => {
    const { id } = req.params; // Retrieves user ID

    try {
        const response = await dbQuery.selectWhere(supabase, "users", "id", id);
        if (response.error) {
            return res.status(404).json({"Message": "User not found"});
        }

     
        const user = response.data[0]; 
        const newBadge = user.badge_id + 1;
        console.log(`The new badge is:  ${newBadge}`)


        const { data, error } = await dbQuery.update(supabase, "users", "id", id, "badge_id", newBadge); // Updates the badge ID
        if (error) {

            return res.status(400).json({"message": "Error updating user progress", "Error": error});
        }

        return res.status(200).json({
            "Message": "Badge updated successfully",
            "badgeId": newBadge,
            "data": data
        });
    } catch (err) {
        console.error("Error caught in updating data:", err); // Use console.error for better error logging
        return res.status(500).json({ "Message": "Error caught in updating data", err }); // Use status 500 for server errors
    }
});

/* Resets the user's points needed */
badgeRouter.put("/points_needed/:id", async(req, res, next) => {
    const { id } = req.params

    try {
        const response = await dbQuery.selectWhere(supabase, "users", "id", id); // Retrieves user details from database
        if (response.error) {
            return res.status(404).json({"Message": "User not found"});
        }


        const { data, error } = await dbQuery.update(supabase, "users", "id", id, "points_to_next_badge", 1000); // Resets the number of points needed
        if (error) {

            return res.status(400).json({"message": "Error updating user progress", "Error": error});
        }

        // Respond with the updated badge ID
        return res.status(200).json({
            "Message": "Points to next badge updated successfully",
            "Points": 1000,
            "data": data
        });
        } catch (err) {
                console.log("Error caught in selecting data: ", err)
                return res.status(400).json({ message: "Error caught in updating data"})
            }
        }
)

export default badgeRouter;