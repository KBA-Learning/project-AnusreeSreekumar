import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    dbUsername: {
        type: String,
        required: true,
        unique: true
    },
    dbEmail: {
        type: String,
        required: true,
        unique: true
    },
    dbPassword: {
        type: String,
        required: true
    },
    dbRole: {
        type: String,
        required: true,
        default: 'Admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Admin = mongoose.model('admindetails', adminSchema);

export default Admin
