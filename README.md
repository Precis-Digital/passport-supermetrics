# passport-supermetrics

[Passport](http://passportjs.org/) strategy for authenticating with [Supermetrics](https://supermetrics.com/) using OAuth.

## Installation

```bash
npm install passport-supermetrics
# or
yarn add passport-supermetrics
```

## Usage

### Configure Strategy

The Supermetrics authentication strategy authenticates users using a Supermetrics account and OAuth tokens. The strategy requires a `verify` callback, which receives the access token and profile, and calls `cb` providing a user.

```typescript
import passport from "passport";
import { SupermetricsStrategy } from "passport-supermetrics";

passport.use(
  new SupermetricsStrategy(
    {
      clientSecret: SUPERMETRICS_CLIENT_SECRET,
      platform: "your-platform",
      callbackURL: "http://localhost:3000/auth/supermetrics/callback",
    },
    function (req, profile, done) {
      // Here you can find or create a user based on the Supermetrics profile
      // profile contains: { loginId: string, displayName: string }
      return done(null, profile);
    }
  )
);
```

### Authenticate Requests

Use `passport.authenticate()` specifying the `'supermetrics'` strategy to authenticate requests.

```typescript
app.get("/auth/supermetrics", passport.authenticate("supermetrics"));

app.get(
  "/auth/supermetrics/callback",
  passport.authenticate("supermetrics", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
```

## Configuration

The strategy accepts the following configuration options:

- `clientSecret`: Your Supermetrics application's client secret (required)
- `platform`: The platform identifier for Supermetrics (required)
- `callbackURL`: URL to which Supermetrics will redirect after authentication (required)

## Profile

The profile object contains the following information:

- `loginId`: The unique identifier for the Supermetrics login
- `displayName`: The display name of the user

## Examples

For complete examples, see the [examples directory](https://github.com/Precis-Digital/passport-supermetrics/tree/main/examples).

## License

[MIT License](LICENSE)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and feature requests, please [open an issue](https://github.com/yourusername/passport-supermetrics/issues).
