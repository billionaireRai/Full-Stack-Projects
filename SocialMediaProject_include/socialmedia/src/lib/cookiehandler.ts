// function handling cookies for usage...
import { cookies } from "next/headers"
import jsonwebtoken , { JwtPayload } from 'jsonwebtoken' 

interface tokenCredentialType {
    id:string,
    email:string
}

const accessTokenSecret = process.env.SECRET_FOR_ACCESS_TOKEN ;
const refreshTokenSecret = process.env.SECRET_FOR_REFRESH_TOKEN

export const getDecodedDataFromCookie = async (cookieName:string) => { 
    const userCookie = await cookies() ; // initializing the cookies variable...
    const Token = userCookie.get(cookieName)?.value ;
    if (!Token) {
        console.log('token is missing !!');
        throw new Error("TOKEN_MISSING")
    }
    if (!accessTokenSecret || !refreshTokenSecret) {
        console.log('Some of the secret is missing !!');
        throw new Error("SECRET_MISSING")
    }
    try {
        const decodedToken = jsonwebtoken.verify(Token,accessTokenSecret) as JwtPayload;
        const tokenData: tokenCredentialType = {
            id: decodedToken.id,
            email: decodedToken.email
        };
        return tokenData;
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('ACCESS_TOKEN_EXPIRED')
    }
 }