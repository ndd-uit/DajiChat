import mongoose from 'mongoose';

const userShema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Loai bo khoang trang o dau va cuoi
        lowercase: true // Chuyen ve chu thuong
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    }, 
    avatarUrl: {
        type: String, // Luu CDN de hien thi hinh
    },
    avatarId: {
        type: String, // Cloudinary public_id de xoa hinh
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    phone: {
        type: String,
        sparse: true, // Cho phep null neu khong unique
    },
}, { 
    timestamps: true // Tao createdAt va updatedAt
});

const User = mongoose.model("User", userShema);
export default User; // Export model de su dung o noi khac