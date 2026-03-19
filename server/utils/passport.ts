import passport from "passport";
import { db } from "../database.ts";
import { Strategy } from "passport-local";
import type { VerifyFunction } from "passport-local";
import * as bcrypt from "bcrypt";

const verifyCB: VerifyFunction = async (username, password, done) => {
  console.log("going");
  try {
    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", username)
      .executeTakeFirst();
    console.log("going....");
    if (!user) {
      console.log("No user ");
      return done(null, false);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log("bad password");
      return done(null, false);
    }

    console.log("bogged in");

    return done(null, user);
  } catch (error) {
    console.log("Error: ", error);
    done(error);
  }
};

export const strategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  verifyCB,
);

passport.serializeUser((user, done) => {
  console.log("Seralise");
  done(null, user.id);
});

passport.deserializeUser(async (userId: string, done) => {
  console.log("deseralise");

  try {
    const user = await db
      .selectFrom("users")
      .where("users.id", "=", userId)
      .innerJoin("cart", "cart.user_id", "users.id")
      .select([
        "users.id",
        "email",
        "name",
        "admin",
        "cart.id as cart_id",
        "default_address_id",
      ])
      .executeTakeFirst();
    if (!user) {
      console.log("no user");
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    done(error);
  }
});
