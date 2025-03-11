# Passport-Supermetrics Examples

This directory contains example implementations of the Passport-Supermetrics authentication strategy.

## Basic Express.js Example

The `basic-express.js` file demonstrates a simple Express.js application using Passport-Supermetrics for authentication.

### Prerequisites

- Node.js installed
- A Supermetrics client secret

### Installation

1. Install the required dependencies:

```bash
npm install express express-session passport
```

2. Set up your environment variables:

```bash
export SUPERMETRICS_CLIENT_SECRET='your-client-secret'
```

### Running the Example

1. Start the server:

```bash
node basic-express.js
```

2. Visit `http://localhost:3000` in your browser

### Features Demonstrated

- Basic Passport-Supermetrics setup
- Session handling
- Protected routes
- User serialization/deserialization
- Login/logout flow
- Callback handling

### Flow

1. User visits the homepage
2. User clicks "Login with Supermetrics"
3. User is redirected to Supermetrics for authentication
4. After successful authentication, user is redirected back to the application
5. User can access protected routes and view their profile information

### Security Notes

- Remember to set proper session secrets in production
- Store client secrets securely using environment variables
- Implement proper error handling in production
- Add CSRF protection for production use
