import { Router } from "express"
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js"
import { upload } from "../middleware/upload.middleware.js"
import {verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()
  router.route("/register").post(
        upload.fields([
            {
                name: "avatar",
                maxCount: 1
            }, 
            {
                name: "coverImage",
                maxCount: 1
            }
        ]),
        registerUser
)

router.route("/login").post(loginUser)

// secured Routes

router.route("/logout").post(verifyJWT, logoutUser) 

// You can use more then one middleware as below
//router.route("/logout").post(verifyJWT,fstmware,secndmware,.....logoutUser) 

        

export default router