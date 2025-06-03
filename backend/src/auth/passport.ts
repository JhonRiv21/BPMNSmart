import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { findOrCreateUserByGoogle } from "../services/auth.service.ts";

const callbackURL = `${process.env.PUBLIC_API_URL}/auth/google/callback`;

console.log('=== DEBUG OAUTH SETUP ===');
console.log('CLIENT_ID:', process.env.OAUTH_CLIENT_ID);
console.log('CALLBACK_URL:', callbackURL);
console.log('PUBLIC_API_URL:', process.env.PUBLIC_API_URL);
console.log('=== END DEBUG ===');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID!,
      clientSecret: process.env.OAUTH_SECRET_CLIENT!,
      callbackURL: callbackURL
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
      try {
        console.log('=== OAUTH CALLBACK EJECUTADO ===');
        console.log('Profile ID:', profile.id);
        console.log('Profile emails:', profile.emails);
        
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName || '';
        const lastNames = profile.name?.familyName || '';

        if (!email) {
          console.error('ERROR: No se obtuvo email de Google');
          return done(new Error('No se obtuvo email de Google'), false);
        }

        const user = await findOrCreateUserByGoogle({ email, firstName, lastNames });
        console.log('Usuario creado/encontrado:', user.id);
        return done(null, user);
      } catch (err: any) {
        console.error('Error en Google Strategy:', err);
        return done(err, false);
      }
    }
  )
);

export default passport;