import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { findOrCreateUserByGoogle, findUserById } from "../services/auth.service.ts";

passport.serializeUser(async (user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID!,
      clientSecret: process.env.OAUTH_SECRET_CLIENT!,
      callbackURL: `${process.env.PUBLIC_API_URL}/auth/google/callback`
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName || '';
        const lastNames = profile.name?.familyName || '';

        if (!email) {
          return done(null, false, { message: 'No se obtuvo email de Google' });
        }

        const user = await findOrCreateUserByGoogle({ email, firstName, lastNames });
        return done(null, user);
      } catch (err: any) {
        return done(err, undefined);
      }
    }
  )
);

export default passport;