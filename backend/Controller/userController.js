import bcrypt from 'bcrypt';
import User from "../Models/userModel.js";
import createTokenAndSaveCookie from "../JWT/generateToken.js";

const saltRounds = 10;

const signUp = async (req, res) => {
    const { userName, email, password, gender, profilePic } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already registered" });
        }

        
        const hashPassword = async (password) => {
            try {
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                return hashedPassword;
            } catch (error) {
                console.error("Error hashing password:", error);
                throw error;
            }
        };

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            userName, email, password: hashedPassword,  gender,
            profilePic: profilePic || ''
        });

        await newUser.save();
        if (newUser) {
            createTokenAndSaveCookie(newUser._id, res);
            res.status(201).json({ message: "User created successfully", newUser });
        }
    }
    catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found with email: ${email}`);
            return res.status(400).json({ error: 'Invalid User Credentials' });
        }

        const comparePassword = async (plainPassword, hashedPassword) => {
            try {
                const match = await bcrypt.compare(plainPassword, hashedPassword);
                return match;
            } catch (error) {
                console.error("Error comparing password:", error);
                throw error;
            }
        };

        const isPasswordMatch = await comparePassword(password, user.password);

        if (!isPasswordMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ error: 'Invalid User Credentials' });
        }

        createTokenAndSaveCookie(user._id, res);
        res.status(200).json({
            message: "User Logged in Successfully",
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                profilePic: user.profilePic
            },
        });
    }
    catch (error) {
        console.error("Error during user login :- ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", { path: '/' });
        res.status(200).json({ message: 'User Logged Out Successfully' });
    }
    catch (error) {
        console.error("Error :- ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const allUsers = async (req, res) => {
    try {

        const loggedInUser = req.user._id;

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUser },
        }).select("-password");

        if (filteredUsers.length === 0) {
            return res.status(404).json({ message: "No other users found" });
        }

        res.status(200).json({ filteredUsers });
    } 
    catch (error) {
        console.log("Error in allUsers Controller: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { signUp, login, logout, allUsers };
