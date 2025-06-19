import jsonwebtoken from 'jsonwebtoken'

/**
 * Decodes and verifies a given JWT token using the provided secret.
 * 
 * @param {string} token - The JWT token to decode. This must be provided for the function to work.
 * @param {string} secret - The secret key used to verify the token's authenticity.
 * @returns {object|undefined} The decoded token information if verification is successful; otherwise undefined.
 * 
 * @throws Will log an error if the token is missing, invalid, or verification fails.
 */
export const decodeGivenJWT = (token, secret) => { 
    if (!token) {
        console.log("JWT token must be provided for decoding.");
        return;
    }
    try {
        const decodedInfo = jsonwebtoken.verify(token,secret);
        // console.log("Decoded JWT Contains :", decodedInfo);
        return decodedInfo;
    } catch (error) {
        console.log("Error in decoding JWT : ", error);
        return;
    }
}
