import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { findOrCreateUserByGoogle } from "../services/auth.service.ts";

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
          return done(new Error('No se obtuvo email de Google'), false);
        }

        const user = await findOrCreateUserByGoogle({ email, firstName, lastNames });
        return done(null, user);
      } catch (err: any) {
        console.error('Error en Google Strategy:', err);
        return done(err, false);
      }
    }
  )
);

export default passport;