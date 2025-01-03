import Users from "../models/users.models.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: "6h",
    });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
        expiresIn: "7d",
    });
};

const registerUser = async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname) return res.status(401).json({ message: "Fullname is required" })
    if (!email) return res.status(401).json({ message: "Email is required" })
    if (!password) return res.status(401).json({ message: "Password is required" })

    try {
        const user = await Users.findOne({ email })
        if (user) return res.status(400).json({ message: "User already exist" })

        const createUser = await Users.create({ fullname, email, password });

        res.json({
            message: "User registered successfully", user: createUser
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email) return res.status(400).json({ message: "Email required" });
    if (!password) return res.status(400).json({ message: "Password required" });

    const user = await Users.findOne({ email })
    if (!user) return res.status(400).json({ message: "User is not registered" })

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Incorrect password" });

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.cookie("refreshToken", refreshToken, { http: true, secure: false });

    res.json({
        message: "User logged In successfully",
        accessToken,
        refreshToken,
        user
    })
}

const logoutUser = async (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "user logout successfully" });
}

const regenerateAccessToken = async (req, res) => {
    // cookies sa refresh token pakarlo
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken)
        return res.status(401).json({ message: "No refresh token found!" });
    // jwt sa check krwao token sahi ha ya nahi
    try {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);


        const user = await Users.findOne({ email: decodedToken.email });

        if (!user) return res.status(404).json({ message: "Invalid token" });

        const generateToken = generateAccessToken(user);
        res.json({ message: "Access token generated", accesstoken: generateToken });
    } catch (error) {
        res.status(500).json({
            error: 'Error occured'
        })
    }

}
const authenticateUser = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(404).json({ message: "No token found" });

    jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        console.log("Authenticate user ===> ", user)
        next();
    });
};


export {registerUser,loginUser,logoutUser,regenerateAccessToken,authenticateUser}