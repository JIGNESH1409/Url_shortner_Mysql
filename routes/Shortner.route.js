import { postShortnerController } from "../controllers/PostShortner.controller.js";
import {RendertoshortUrlController} from "../controllers/RendertoshortUrl.controller.js";
import {getEditShortnerPage, postEditShortnerPage, getShortnerPage, deleteShortUrl, getLinksApi, getLinkByIdApi} from "../controllers/PostShortner.controller.js";
import express from "express";
const router = express.Router();

router.get('/', getShortnerPage);

router.post('/', postShortnerController);

router.route('/edit/:id').get(getEditShortnerPage).post(postEditShortnerPage);

router.route("/delete/:id").post(deleteShortUrl)

router.get("/api/me", (req, res) => {
	if (!req.user) return res.status(200).json({ isLoggedIn: false, user: null });
	return res.status(200).json({
		isLoggedIn: true,
		user: { id: req.user.id, name: req.user.name, email: req.user.email }
	});
});

router.get("/api/links", getLinksApi);
router.get("/api/links/:id", getLinkByIdApi);
router.post("/api/links", postShortnerController);
router.put("/api/links/:id", postEditShortnerPage);
router.delete("/api/links/:id", deleteShortUrl);

router.get('/favicon.ico', (req, res) => res.status(204).end());

// keep /:shortcode LAST — it matches any single-segment path
router.get("/:shortcode", RendertoshortUrlController);

export { router as shorturlRouter };
