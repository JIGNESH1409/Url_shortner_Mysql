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
import path from "path";

const wantsJson = (req) => {
    const accept = req.headers.accept || "";
    return req.xhr || req.is("application/json") || accept.includes("application/json");
};
export const getRegisterpage = (req, res) => {
    return res.sendFile(path.resolve("public", "register.html"));
}
export const postRegisterpage = async(req, res) => {
    try {
        console.log(req.body);

        const {data, error} = registerSchema.safeParse(req.body);

        if(error){
            const message = error.errors[0].message;
            if (wantsJson(req)) {
                return res.status(400).json({ error: message });
            }
            req.flash("error", message);
            return res.redirect("/register");
        }

        const {name, email, password} = data;

        const userExist = await userCheckExist(email);
        console.log("USER EXIST =>", userExist);

        if(userExist) {
            const message = "User already exists with this email";
            if (wantsJson(req)) {
                return res.status(409).json({ error: message });
            }
            req.flash("error", message);
            return res.redirect("/register"); 
        }

        const hashedpassword = await hashPassword(password);
        const userCreate = await createUser(name, email, hashedpassword);

        console.log("USER CREATE =>", userCreate);
        if (wantsJson(req)) {
            return res.status(201).json({ ok: true });
        }
        return res.redirect("/login");
    } catch(err) {
        console.error("Registration Error:", err);
        const message = "An error occurred during registration. Please try again.";
        if (wantsJson(req)) {
            return res.status(500).json({ error: message });
        }
        req.flash("error", message);
        return res.redirect("/register");
    }
}
export const getLoginpage = (req, res) => {
    return res.sendFile(path.resolve("public", "login.html"));
}

export const postLoginpage = async (req, res) => {
    try {
        const {data, error} = loginSchema.safeParse(req.body);

        if(error){
            const message = error.errors[0].message;
            if (wantsJson(req)) {
                return res.status(400).json({ error: message });
            }
            req.flash("error", message);
            return res.redirect("/login");
        }

        const {email, password} = data;

        if(email.trim() === "" || password.trim() === ""){
            const message = "Email and password are required";
            if (wantsJson(req)) {
                return res.status(400).json({ error: message });
            }
            return res.redirect("/login");
        }

        const userExist = await userCheckExist(email);
        console.log("USER EXIST =>", userExist);

        if(!userExist) {
            const message = "Invalid email or password";
            if (wantsJson(req)) {
                return res.status(401).json({ error: message });
            }
            req.flash("error", message);
            return res.redirect("/login"); 
        }

        const isPasswordMatch = await comparePassword(password, userExist.password);
        
        if(!isPasswordMatch){
            const message = "Invalid email or password";
            if (wantsJson(req)) {
                return res.status(401).json({ error: message });
            }
            req.flash("error", message);
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

        if (wantsJson(req)) {
            return res.status(200).json({ ok: true });
        }
        return res.redirect("/");
    } catch(err) {
        console.error("Login Error:", err);
        const message = "An error occurred during login. Please try again.";
        if (wantsJson(req)) {
            return res.status(500).json({ error: message });
        }
        req.flash("error", message);
        return res.redirect("/login");
    }
}


export const getMePage = (req, res) => {
    if (!req.user) {
        const accept = req.headers.accept || "";
        if (req.xhr || accept.includes("application/json")) {
            return res.status(401).json({ error: "Please login first" });
        }
        req.flash("error", "Please login first");
        return res.redirect("/login");
    }
    const accept = req.headers.accept || "";
    if (req.xhr || accept.includes("application/json")) {
        return res.status(200).json({
            user: { id: req.user.id, name: req.user.name, email: req.user.email }
        });
    }
    return res.send(`Your details - Name: ${req.user.name}, Email: ${req.user.email}`);
}

export const getLogout = (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.redirect("/login");
}
