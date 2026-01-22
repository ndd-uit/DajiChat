import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

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

const ACCESS_TOKEN_TTL = '30m'; // thuong < 15p
const REFRESH_TOKEN_TTL = 14*24*60*60*1000; // 14 ngay theo mls

export const signIn = async (req, res) => {
    try {
        //lay inputs
        const {username, password} = req.body;

        if(!username || !password) {
            return res.status(400).json({message:'Thiếu username hoặc password!'})
        }
        //lay hashedPassword trong db de so voi password input
        const user = await User.findOne({username})
        if(!user) {
            return res.status(401).json({message:'username hoặc password không chính xác!'})
        }
        //kiem tra password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if(!passwordCorrect) {
            return res.status(401).json({message:'username hoặc password không chính xác!'})
        }
        // neu khop -> tao accessToken voi JWT
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL})
        // tao refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex')
        // tao session moi de luu refresh token
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
        })
        // tra refresh token ve trong cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, //khong the truy cap boi JS
            secure: true, // dam bao truy cap bang https
            sameSite: 'none', // backend, frontend deloy rieng
            maxAge: REFRESH_TOKEN_TTL
        })
        // tra acess token ve trong res
        return res.status(200).json({message:`User ${user.displayName} đã logged in!`}, accessToken)
    } catch (error) {
        console.error('Lỗi khi gọi signIn', error)
        return res.status(500).json({message:'Lỗi hệ thống!'})
    }
}