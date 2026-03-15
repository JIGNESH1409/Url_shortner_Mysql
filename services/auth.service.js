import { db } from "../config/db.js";
import { usersTable, sessionsTable } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const userCheckExist=async(email)=>{
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email,email));

    return user;
}

export const createUser =async (name,email,hashedpassword)=>{
    return await db
    .insert(usersTable)
    .values({
        name,
        email,
        password:hashedpassword
    })
    .$returningId();
}

export const hashPassword=async(password)=>{
    return await argon2.hash(password);
}

export const comparePassword = async (password, hashedPassword) => {
    if (!hashedPassword) {
        throw new Error("Stored password hash is missing for this user");
    }

    if (typeof Buffer !== "undefined" && Buffer.isBuffer(hashedPassword)) {
        hashedPassword = hashedPassword.toString();
    }

    if (typeof hashedPassword !== "string") {
        hashedPassword = String(hashedPassword);
    }

    if (!hashedPassword.startsWith("$")) {
        throw new Error("Stored password hash is not in PHC format (missing leading '$')");
    }

    return await argon2.verify(hashedPassword, password);
};
export const generateToken = ({ id, name, email }) => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new Error("Missing environment variable: JWT_SECRET_KEY");
    }

    return jwt.sign({ id, name, email }, secret, {
        expiresIn: "20d",
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token,process.env.JWT_SECRET_KEY);
}

export const createSession = async(userID,{ip,userAgent})=>{
    const [session]= await db.insert(sessionsTable).values({
        userID,
        ip,
        userAgent
    }).$returningId();
    return session;
}

export const createAccesToken = ({id,name,email,sessionID})=>{
    return jwt.sign({id,name,email,sessionID},process.env.JWT_SECRET_KEY,{
        expiresIn:"20d"
    });
}

export const createRefreshToken = (sessionID)=>{
    return jwt.sign({sessionID},process.env.JWT_SECRET_KEY,{
        expiresIn:"30d"
    });
}

export const findBySessionID=async(sessionID)=>{
    const[session]= await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionID))
    return session;

}

export const findUserBySessionID=async(userID)=>{
    const [user]= await db.select().from(usersTable).where(eq(usersTable.id,userID));
    return user;
}

export const refreshTokens=async(refreshToken)=>{
    try{
        const decodedToken = await verifyToken(refreshToken);

        const currentSession = await findBySessionID(decodedToken.sessionID);

        if(!currentSession || currentSession.valid === false){
            throw new Error("Invalid session");
        }
        const user = await findUserBySessionID(currentSession.userID);

        const userInfo={
            id:user.id,
            name:user.name,
            email:user.email,
            sessionID:currentSession.id
        }

        const newAccessToken = createAccesToken(userInfo);
        const newRefreshToken = createRefreshToken(currentSession.id);

        return { newAccessToken, newRefreshToken, userInfo };

    }
    catch(error){
        console.error("Refresh token verification failed:", error.message);
        return null;
    }

}
