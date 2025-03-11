const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SupermetricsStrategy = require("../lib/strategy").default;

const app = express();

// Session middleware setup
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new SupermetricsStrategy(
    {
      clientSecret: process.env.SUPERMETRICS_CLIENT_SECRET,
    },
    (req, linkId, dataSourceLoginId, displayName, done) => {
      const user = {
        id: dataSourceLoginId,
        linkId: linkId,
        displayName: displayName,
      };
      return done(null, user);
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get("/", (req, res) => {
  res.send(`
    <h1>Passport-Supermetrics Example</h1>
    ${
      req.user
        ? `<p>Welcome ${req.user.displayName}! <a href="/logout">Logout</a></p>`
        : `<p><a href="/auth/supermetrics">Login with Supermetrics</a></p>`
    }
  `);
});

// Initialize Supermetrics authentication
app.get("/auth/supermetrics", passport.authenticate("supermetrics"));

// Supermetrics authentication callback
app.get(
  "/auth/supermetrics/callback",
  passport.authenticate("supermetrics", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Logout route
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Protected route example
app.get("/protected", ensureAuthenticated, (req, res) => {
  res.send(`
      <h1>Protected Page</h1>
      <p>Hello ${req.user.displayName}!</p>
      <p>Your Link ID: ${req.user.linkId}</p>
      <p>Your Data Source Login ID: ${req.user.id}</p>
      <p><a href="/">Home</a></p>
    `);
});

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
