import express from "express"
import { registerUser,loginUser,logoutUser,regenerateAccessToken, authenticateUser}
 from "../controllers/users.controller.js";


const router = express.Router();



router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/generatetoken', regenerateAccessToken)
router.get('/userdata', authenticateUser, (req, res) => {
    res.send("you are getting all user detail")
})



export default router