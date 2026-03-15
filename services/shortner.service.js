import { db } from "../config/db.js";
import { shortLink } from "../drizzle/schema.js";
import { eq, and } from "drizzle-orm";

export const getAllShortLinks = async (userID) => {
    return await db.select().from(shortLink).where(eq(shortLink.userID,userID));
};

export const insertLink = async ({ url, finalshort,userID }) => {
    await db.insert(shortLink).values({
        url,
        short_url: finalshort,
        userID

    });
};
export const getLinkbyShorturl = async (shortcode, userID) => {
    const link = await db
        .select()
        .from(shortLink)
        .where(and(eq(shortLink.short_url, shortcode), eq(shortLink.userID, userID)));

    return link[0];
};

// Public lookup — no userID filter (used by the redirect route)
export const getPublicLinkByShorturl = async (shortcode) => {
    const link = await db
        .select()
        .from(shortLink)
        .where(eq(shortLink.short_url, shortcode));

    return link[0];
}

export const getLinkById = async (id) => {
    const link = await db.select().from(shortLink).where(eq(shortLink.id,id));
    return link[0];
};

export const deleteById=async(id)=>{
    await db.delete(shortLink).where(eq(shortLink.id,id));
}