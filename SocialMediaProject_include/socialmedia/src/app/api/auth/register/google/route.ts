
// redirecting to googles authentication page...

// https://accounts.google.com/o/oauth2/v2/auth
//   ?client_id=GOOGLE_CLIENT_ID
//   &redirect_uri=https://yourapp.com/api/auth/google/callback
//   &response_type=code
//   &scope=email profile
//   &state=randomString


// callback getting back to my server with a code...
// https://yourapp.com/api/auth/google/callback?code=AUTH_CODE&state=randomString

// backend exchanges code with acccess-token...

// POST https://oauth2.googleapis.com/token
// Content-Type: application/x-www-form-urlencoded

// code=AUTH_CODE
// &client_id=GOOGLE_CLIENT_ID
// &client_secret=GOOGLE_CLIENT_SECRET
// &redirect_uri=https://yourapp.com/api/auth/google/callback
// &grant_type=authorization_code


// google response in exchange... 

// {
//   "access_token": "ya29.a0AfH6SMC...",
//   "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI...",
//   "refresh_token": "1//0gkF... ",
//   "expires_in": 3600,
//   "token_type": "Bearer"
// }


// fetching user profile with the help of access-token...
// GET https://www.googleapis.com/oauth2/v2/userinfo
// Authorization: Bearer ACCESS_TOKEN

// Backend creates/updates user in DB


// Backend sends session/JWT to frontend

import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {
    
}