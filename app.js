import "dotenv/config";
import cookieParser from "cookie-parser"; 
import flash from "connect-flash";
import requestIp from "request-ip";
import session from "express-session";
import express from "express";
import { shorturlRouter } from "./routes/Shortner.route.js";
import { authRouter } from "./routes/auth.route.js";

import { verifyAuthentication } from "./middleware/vertify-auth-middleware.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
// app.set("views", "./views")

app.use(cookieParser());

const sessionConfig = {
  secret: process.env.SESSION_SECRET || "my-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

app.use(session(sessionConfig));
app.use(flash());
// This must be after cookieParser middleware.

app.use(requestIp.mw());
app.use(verifyAuthentication);

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isLoggedIn = !!req.user;
  return next();
});

// How It Works:
// This middleware runs on every request before reaching the route handlers.
//? res.locals is an object that persists throughout the request-response cycle.
//? If req.user exists (typically from authentication, like Passport.js), it's stored in res.locals.user.
//? Views (like EJS, Pug, or Handlebars) can directly access user without manually passing it in every route.

// express router
app.get("/", (req, res) => {
  if(req.user) {
    return res.render("index");
  }
  res.redirect("/login");
});

app.use(authRouter);
app.use(shorturlRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  res.status(statusCode).send(message);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});