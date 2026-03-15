import crypto from "crypto";
import { getLinkbyShorturl, insertLink,getLinkById,deleteById } from "../services/shortner.service.js";

import z  from "zod";


import {shortnerSchema} from "../validator/shortner-validator.js";

export const getShortnerPage = async(req,res)=>{
    return res.render("index",{links,host :req.headers.host,errors:req.flash("error")});
}
export const postShortnerController = async (req, res) => {
    try {

        const {data, error} = shortnerSchema.safeParse(req.body);

        if(error){
            req.flash("error", error.issues[0].message);
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
            req.flash("error", "You already have a link with this shortcode. Please choose another one.");
            return res.redirect("/");
        }

        await insertLink({ url, finalshort, userID: req.user.id });
        return res.redirect("/");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};

export const getEditShortnerPage=async(req,res)=>{
   // const id = req.params
    const {data:id, error}=z.coerce.number().int().safeParse(req.params.id);

    if(error) return res.redirect("404");

    try{
        const shortLink = await getLinkById(id);

        if(!shortLink){
            return res.redirect("404");
        }
        res.render("edit-shortner",
            {
                id: shortLink.id,
                url: shortLink.url,
                shortCode: shortLink.short_url,
                errors: req.flash("error"),
            }
        )

    }
    catch(err){
        console.error(err);
    }


}

export const deleteShortUrl=async(req,res)=>{

    const {data:id,error}=z.coerce.number().int().safeParse(req.params.id);
    if(error) return res.redirect("404");
    try{
        await deleteById(id);
        return res.redirect("/");

    }
    catch(err){
        console.error(err);
    }
}