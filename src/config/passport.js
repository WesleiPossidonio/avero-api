import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../app/models/Users.js";
import dotenv from 'dotenv'
dotenv.config()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://avero-api.vercel.app/auth/google/callback"
},

  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ where: { googleId: profile.id } });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0].value,
          provider: "google",
        });
      }

      return done(null, user);

    } catch (err) {
      return done(err, null);
    }
  }
));

export default passport;
