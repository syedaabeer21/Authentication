import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        fullname:{
            type: String,
            required : [true , "Fullname is required"]    
        },
        email: {
            type: String,
            required : [true , "Email is required"]
        },
        password: {
            type: String,
            required : [true , "Password is required"]
        }
    },
    {
        timestamps:true
    }
)
    userSchema.pre("save" , async function name(next) {
        if(!this.isModified("password")) return next()     
            this.password = await bcrypt.hash(this.password , 10)
            next()  
    })

    export default mongoose.model("Users" , userSchema)


