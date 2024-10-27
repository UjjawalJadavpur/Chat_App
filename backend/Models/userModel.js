import mongoose from 'mongoose';


const userSchema = mongoose.Schema({
    userName: {
        type: String, 
        required: true
        // minlength: 3, 
        // maxlength: 50,
    },
    email: {
        type: String, 
        required: true, 
        unique: true
        // match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type:String, 
        required:true
        // minlength: 6,
    },
    gender: {
        type: String, 
        enum: ['male', 'female', 'transgender'], 
        required: true 
    },
    profilePic: {
        type: String,  // Could store URL or a file path
        required: false 
    },
    lastSeen: {
        type: Date,
        default: null, // Default to null when online
    },

},{timestamps:true});

const User = mongoose.model('User',userSchema);
export default User;