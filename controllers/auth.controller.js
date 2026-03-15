import { userCheckExist } from "../services/auth.service.js";
import { createUser } from "../services/auth.service.js";
import { hashPassword } from "../services/auth.service.js";
import { comparePassword } from "../services/auth.service.js";
import { generateToken } from "../services/auth.service.js";
import {loginSchema} from "../validator/auth-validator.js";
import {registerSchema} from "../validator/auth-validator.js";
import { createSession } from "../services/auth.service.js";
import { createAccesToken } from "../services/auth.service.js";
import { createRefreshToken } from "../services/auth.service.js";
export const getRegisterpage = (req, res) => {

    res.render("auth/register", { isLoggedIn: res.locals.isLoggedIn, errors: req.flash("error") });
}
export const postRegisterpage = async(req, res) => {
    try {
        console.log(req.body);

        const {data, error} = registerSchema.safeParse(req.body);

        if(error){
            req.flash("error", error.errors[0].message);
            return res.redirect("/register");
        }

        const {name, email, password} = data;

        const userExist = await userCheckExist(email);
        console.log("USER EXIST =>", userExist);

        if(userExist) {
            req.flash("error", "User already exists with this email");
            return res.redirect("/register"); 
        }

        const hashedpassword = await hashPassword(password);
        const userCreate = await createUser(name, email, hashedpassword);

        console.log("USER CREATE =>", userCreate);
        res.redirect("/login");
    } catch(err) {
        console.error("Registration Error:", err);
        req.flash("error", "An error occurred during registration. Please try again.");
        return res.redirect("/register");
    }
}
export const getLoginpage = (req, res) => {


    res.render("auth/login", { isLoggedIn: res.locals.isLoggedIn, errors: req.flash("error") });
}

export const postLoginpage = async (req, res) => {
    try {
        const {data, error} = loginSchema.safeParse(req.body);

        if(error){
            req.flash("error", error.errors[0].message);
            return res.redirect("/login");
        }

        const {email, password} = data;

        if(email.trim() === "" || password.trim() === ""){
            return res.render("auth/login", { isLoggedIn: res.locals.isLoggedIn, errors: ["Email and password are required"] })
        }

        const userExist = await userCheckExist(email);
        console.log("USER EXIST =>", userExist);

        if(!userExist) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/login"); 
        }

        const isPasswordMatch = await comparePassword(password, userExist.password);
        
        if(!isPasswordMatch){
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
        } 
        
        // const token = generateToken({
        //     id: userExist.id,
        //     name: userExist.name,
        //     email: userExist.email
        // })

        // res.cookie("accestoken", token);

        const session = await createSession(userExist.id,{
            ip:req.clientIp,
            userAgent: req.headers["user-agent"]
        });

        const accesToken = createAccesToken({
            id: userExist.id,
            name: userExist.name,
            email: userExist.email,
            sessionID: session.id
        })

        const refreshToken =  createRefreshToken(session.id)

        res.cookie("access_token", accesToken)
        res.cookie("refresh_token", refreshToken)

        res.redirect("/");
    } catch(err) {
        console.error("Login Error:", err);
        req.flash("error", "An error occurred during login. Please try again.");
        return res.redirect("/login");
    }
}


export const getMePage = (req, res) => {
    if (!req.user) {
        req.flash("error", "Please login first");
        return res.redirect("/login");
    }
    return res.send(`Your details - Name: ${req.user.name}, Email: ${req.user.email}`);
}

export const getLogout = (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.redirect("/login");
}
