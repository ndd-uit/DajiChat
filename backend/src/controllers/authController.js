import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const signUp = async (req, res) => {
    try {
        const {username, password, email, firstName, lastName} = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({message:"Tất cả các trường đều bắt buộc"});
        }

        // Kiem tra username
        const duplicate = await User.findOne({username});

        if(duplicate) {
            return res.status(409).json({message:"Username đã tồn tại"});
        }
        // ma hoa mat khau - lưu trong db thay vì mật khẩu thật
        const hashedPassword = await bcrypt.hash(password, 10); // salt = 10
        // tao user moi
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        })
        //return
        return res.sendStatus(204)
    } catch (error) {
        console.error('Lỗi khi gọi signUp', error)
        return res.status(500).json({message:'Lỗi hệ thống!'})
    }
};

export const signIn = async (req, res) => {
    try {
        //lay inputs
        const {username, password} = req.body;

        if(!us)
        //lay hashedPassword trong db de so voi password input

        // neu khop -> tao accessToken voi JWT

        // tao refresh token

        // tao session moi de luu refresh token

        // tra refresh token ve trong cookie

        // tra acess token ve trong res
    } catch (error) {
        console.error('Lỗi khi gọi signIn', error)
        return res.status(500).json({message:'Lỗi hệ thống!'})
    }
}