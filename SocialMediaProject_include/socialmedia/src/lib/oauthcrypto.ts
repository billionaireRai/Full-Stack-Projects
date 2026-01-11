import crypto from "crypto";

// Generate cryptographically secure random string...
export function generateRandomString(length:number = 32) :string {
  return crypto.randomBytes(length).toString("hex");
}

// Base64 URL encode (RFC 7636)
function base64UrlEncode(buffer: Buffer) : string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Generate PKCE verifier + challenge for security...
export function generatePKCE() {
  const codeVerifier = base64UrlEncode(crypto.randomBytes(32));
  const challenge = base64UrlEncode(crypto.createHash("sha256").update(codeVerifier).digest());

  return {
    codeVerifier,
    codeChallenge: challenge,
    codeChallengeMethod: "S256",
  };
}
