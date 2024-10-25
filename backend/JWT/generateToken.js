import jwt from 'jsonwebtoken';

const createTokenAndSaveCookie = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
        expiresIn: "10d"
    });
    
    res.cookie("jwt", token,
             {
            httpOnly: false,    // ( httpOnly: false,  Cookie can be accessed via JavaScript)
            secure: false,
            sameSite: "lax",
            maxAge: 10*24*60*60*1000,
            path: "/" 
        }
    );

    console.log("generateToken.js --- Response Headers: ",res.getHeaders());
}

export default createTokenAndSaveCookie;