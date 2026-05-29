import crypto from "crypto";
import {
    getLinkbyShorturl,
    insertLink,
    getLinkByIdForUser,
    updateLinkById,
    deleteById,
    getAllShortLinks
} from "../services/shortner.service.js";

import z  from "zod";


import {shortnerSchema} from "../validator/shortner-validator.js";
import path from "path";

const wantsJson = (req) => {
    const accept = req.headers.accept || "";
    return req.xhr || req.is("application/json") || accept.includes("application/json");
};

export const getShortnerPage = async(req,res)=>{
    if (!req.user) return res.redirect("/login");
    return res.sendFile(path.resolve("public", "index.html"));
}
export const postShortnerController = async (req, res) => {
    try {
        if (!req.user) {
            if (wantsJson(req)) {
                return res.status(401).json({ error: "Please log in to use" });
            }
            return res.redirect("/login");
        }

        const {data, error} = shortnerSchema.safeParse(req.body);

        if(error){
            const message = error.issues[0].message;
            if (wantsJson(req)) {
                return res.status(400).json({ error: message });
            }
            req.flash("error", message);
            return res.redirect("/");
        }

        const { url, shortCode } = data;

        if (!url) {
            return res.status(400).send("URL is required");
        }

        const finalshort =
            shortCode && shortCode.trim()
                ? shortCode.trim().toLowerCase()
                : crypto.randomBytes(4).toString("hex");

        console.log("FINAL SHORTCODE =>", finalshort);

        // Check if this user already owns this shortcode
        const existing = await getLinkbyShorturl(finalshort, req.user.id);
        if (existing) {
            const message = "You already have a link with this shortcode. Please choose another one.";
            if (wantsJson(req)) {
                return res.status(409).json({ error: message });
            }
            req.flash("error", message);
            return res.redirect("/");
        }

        await insertLink({ url, finalshort, userID: req.user.id });
        if (wantsJson(req)) {
            return res.status(201).json({ ok: true });
        }
        return res.redirect("/");
    } catch (err) {
        console.error(err);
        if (wantsJson(req)) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(500).send("Internal Server Error");
    }
};

export const getEditShortnerPage=async(req,res)=>{
    if (!req.user) return res.redirect("/login");
    const {data:id, error}=z.coerce.number().int().safeParse(req.params.id);

    if(error) return res.redirect("404");

    try{
        const shortLink = await getLinkByIdForUser(id, req.user.id);

        if(!shortLink){
            return res.redirect("404");
        }
        return res.sendFile(path.resolve("public", "edit-shortner.html"));

    }
    catch(err){
        console.error(err);
    }
}

export const postEditShortnerPage = async (req, res) => {
    if (!req.user) {
        if (wantsJson(req)) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        return res.redirect("/login");
    }
    const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
    if (error) return res.redirect("404");

    const { data, error: bodyError } = shortnerSchema.safeParse(req.body);
    if (bodyError) {
        const message = bodyError.issues[0].message;
        if (wantsJson(req)) {
            return res.status(400).json({ error: message });
        }
        req.flash("error", message);
        return res.redirect(`/edit/${id}`);
    }

    try {
        const shortLink = await getLinkByIdForUser(id, req.user.id);
        if (!shortLink) return res.redirect("404");

        const nextShortUrl = data.shortCode.trim().toLowerCase();

        const existing = await getLinkbyShorturl(nextShortUrl, req.user.id);
        if (existing && existing.id !== id) {
            const message = "You already have a link with this shortcode. Please choose another one.";
            if (wantsJson(req)) {
                return res.status(409).json({ error: message });
            }
            req.flash("error", message);
            return res.redirect(`/edit/${id}`);
        }

        await updateLinkById({
            id,
            userID: req.user.id,
            url: data.url,
            shortUrl: nextShortUrl
        });

        if (wantsJson(req)) {
            return res.status(200).json({ ok: true });
        }
        return res.redirect("/");
    } catch (err) {
        if (err.code === "23505") {
            const message = "Shortcode already exists, please choose another";
            if (wantsJson(req)) {
                return res.status(409).json({ error: message });
            }
            req.flash("error", message);
            return res.redirect(`/edit/${id}`);
        }
        console.error(err);
        if (wantsJson(req)) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(500).send("Internal Server Error");
    }
}

export const deleteShortUrl=async(req,res)=>{

    if (!req.user) {
        if (wantsJson(req)) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        return res.redirect("/login");
    }
    const {data:id,error}=z.coerce.number().int().safeParse(req.params.id);
    if(error) return res.redirect("404");
    try{
        await deleteById(id);
        if (wantsJson(req)) {
            return res.status(200).json({ ok: true });
        }
        return res.redirect("/");

    }
    catch(err){
        console.error(err);
    }
}

export const getLinksApi = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    try {
        const links = await getAllShortLinks(req.user.id);
        const viewLinks = links.map((link) => ({
            id: link.id,
            shortCode: link.short_url,
            url: link.url,
        }));
        return res.status(200).json({ links: viewLinks });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getLinkByIdApi = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
    if (error) return res.status(400).json({ error: "Invalid id" });

    try {
        const link = await getLinkByIdForUser(id, req.user.id);
        if (!link) return res.status(404).json({ error: "Not found" });
        return res.status(200).json({
            link: {
                id: link.id,
                shortCode: link.short_url,
                url: link.url,
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};