# WIP E-Commerce Project

**A Node/Express, React, and Postgres Project.**

## What it is:

A proof of concept ecommerce website, with an admin panel and guest checkout.

### What the admin panel does:

Add or edit products and categories, including image uploads to Cloudinary.
Drag-and-Drop prodct/category images using React Dropzone.
Add or edit frontpages, create a frontpage products and categories combination, easily switch between previously created ones.
All forms are built using Tanstack Form.

### Frontend functionality and libraries:

A user can register and login, a session (Express Session) for a guest user is stored by default.
Users and guests can search for products, add them to their cart, which utilises react contexts.
They can checkout, whether signed in or not, guests are prompted with a form to enter their address, which is stored in the database and added as a search param on the checkout page.
Checking out is done using Stripe's API's PaymentIntent.

Routing is done through Tanstack Router, utilising its context integrations and protected routes functionalities.

Images are loaded from Cloudinary, utilising its dynamic resizing to minimise load times and serve size appropriate images.

Product image fullsize zoom uses React Inner Image Zoom library.

### Backend functionality and libraries:

A Typescript Express server to handle API requests, session, and cookies.
Authentication is done using Passport username (email in this case) and password.
Express Session creates the session and sets the HTML-Only cookie, storing the session to the database too.
The PostgreSQL database is hosted on Neon, Kysely is used as a typesafe query-builder to maximise functionality (compared to being limited like with Prisma, but having the typesafety and autocomplete tools of Kysely to minimise typos and silly errors).

When a session or a cart is created, using Passport, custom information are added to the express Request, with custom types expanding the default express type keys and objects, to ensure typesafety (and compatibility).
Like for example adding the user_id or the cart_id to the session object in the Request.
