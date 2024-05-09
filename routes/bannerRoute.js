import express from "express";
import { cadastroBanner, getBanner, editarBanner } from "../controllers/bannerController.js";

const bannerRouter = express.Router();

bannerRouter.post("/cadastrarbanner", cadastroBanner);
bannerRouter.get("/getBanner/:pid", getBanner);
bannerRouter.put("/editarBanner/:pid", editarBanner);

export default bannerRouter;