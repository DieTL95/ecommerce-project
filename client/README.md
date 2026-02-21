Users, Cart, and Auth steps:

Cart: UserId, SessionID, strings
Passport: SessionID, session: { user: Nullable}

Guest: SessionID

Guest visits site, is issued a sessionID.
Adds product to cart: creates cart with SessionID. No UserId.

Registers and logsin: add userId to Cart with matching sessionID

<!---------------------------------------------------------------->

Cart Context
