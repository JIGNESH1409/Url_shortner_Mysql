import { getPublicLinkByShorturl } from "../services/shortner.service.js";

export const RendertoshortUrlController = async (req, res) => {
    try {
        const { shortcode } = req.params;

        const link = await getPublicLinkByShorturl(shortcode);
        if (!link) {
            return res.status(404).send("Short url not found");
        }

        return res.redirect(link.url);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
