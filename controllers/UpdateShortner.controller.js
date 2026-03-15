
import {getAllShortLinks} from "../services/shortner.service.js";
export const UpdateShortnerController = async (req, res) => {

    try {
        if(!req.user){
            return res.redirect("/login");

        }
        const links = await getAllShortLinks(req.user.id);
        const viewLinks = links.map((link) => ({
            id: link.id,
            shortCode: link.short_url,
            url: link.url,
        }));
        return res.render("index", {
            links: viewLinks,
            host: req.headers.host,
            errors: req.flash("error"),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};
