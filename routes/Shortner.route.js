import { postShortnerController } from "../controllers/PostShortner.controller.js";
import {RendertoshortUrlController} from "../controllers/RendertoshortUrl.controller.js";
import {UpdateShortnerController} from "../controllers/UpdateShortner.controller.js";
import {getEditShortnerPage} from "../controllers/PostShortner.controller.js";
import { deleteShortUrl } from "../controllers/PostShortner.controller.js";
import express from "express";
const router = express.Router();

router.get('/', UpdateShortnerController);

router.post('/', postShortnerController);

router.get('/edit/:id', getEditShortnerPage);

// keep /:shortcode LAST — it matches any single-segment path
router.get("/:shortcode", RendertoshortUrlController);

router.route("/delete/:id").post(deleteShortUrl)

export { router as shorturlRouter };
