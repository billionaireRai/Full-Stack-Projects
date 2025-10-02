import asyncErrorHandler from "@/middlewares/errorMiddleware";
import { cookies } from "next/headers";
import { decodeGivenJWT } from "@/lib/decodejwt";
import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/db/dbConnection";
import sharedvaults from "@/db/models/sharedVaultModel";
import crypto from "crypto";
import vaultitems from "@/db/models/vaultModel";
import users from "@/db/models/userModel";
import breachwatchs from "@/db/models/breachWatchModel";

const POST = asyncErrorHandler ( async () => {
    console.log("Triggering the Route handler for Breach Info...") // general log...

    // cookies related logic...
    const allCookies = await cookies() ; 
    const accessToken = allCookies.get('accessToken').value ;
    const decoded = decodeGivenJWT(accessToken,process.env.SECRET_FOR_ACCESS_TOKEN) ;

    // general debugging step...
    if (!decoded) {
        console.log("Authentication required for Getting breach info...");
        return NextResponse.json({ message:'user authentication failed signup OR login !!!' },{ status: 401 }) ;
    }

    await connectWithMongoDB() ; // establishing the DB connection...

    // on user credentials and each vault item encrypted data... 
    const user = await users.findById(decoded.id).select('password email encryptionSalt'); 

    const userSharedItems = await sharedvaults.find({ ownerId:decoded.id }) ;
    const userPrivateVault = await vaultitems.find({ userId:decoded.id }) ;

    const totalVaults = [...userSharedItems,...userPrivateVault]; // total vaults...

    // Initialize breach tracking
    let breachStats = {
        totalBreach: 0,
        itemsAtRisk: 0,
        resolvedBreaches: 0
    };

    let breachData = [];
    let checkedCredentials = new Set();

    // Check user's password against HIBP...
    const userPasswordHash = crypto.createHash('sha1').update(user.password).digest('hex').toUpperCase();
    const userPasswordBreachCount = await checkHIBP(userPasswordHash);
    
    if (userPasswordBreachCount > 0) {
        breachStats.totalBreach += userPasswordBreachCount;
        breachStats.itemsAtRisk += 1;
        
        breachData.push({
            credential: user.email,
            usedIn: 'User account password',
            breachCount: userPasswordBreachCount,
            otherInfo: [
                'Password hash found in breached databases',
                'Recommended Action: Change your password immediately'
            ]
        });
        
        checkedCredentials.add(user.password);
    }

    // check the breach , keep the track...
    

    // items at risk will contain breach count which are MOST VULNERABLE...
    // resolved breach when the user will take action on crededntials , increase resolved breach by 1...

    // if on any credential found thee breach then with mentioned feild push it in the breachData array...
    
    // Update breach watch record
    await updateBreachWatchRecord(decoded.id, breachStats, breachData);
    return NextResponse.json({ breachStats, breachData, message: 'Breach check completed successfully'},{ status:200 });
})

// HIBP API integration
async function checkHIBP(passwordHash) {
    const prefix = passwordHash.substring(0, 5);
    const suffix = passwordHash.substring(5);
    
    try {
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            headers: {
                'User-Agent': 'PasswordManager-BreachWatch/1.0',
                'Add-Padding': 'true'
            }
        });

        if (!response.ok) {
            console.error('HIBP API error:', response.status);
            return 0;
        }

        const data = await response.text();
        const lines = data.split('\n');
        
        for (const line of lines) {
            const [hashSuffix, count] = line.split(':');
            if (hashSuffix === suffix) {
                return parseInt(count, 10);
            }
        }
        
        return 0;
    } catch (error) {
        console.error('Error checking HIBP:', error);
        return 0;
    }
}

// Update breach watch record...
async function updateBreachWatchRecord(userId, breachStats, breachData) {
    try {
        let breachRecord = await breachwatchs.findOne({ userId });
        
        if (!breachRecord) {
            breachRecord = new breachwatchs({
                userId,
                emailChecked: true,
                breachFounds: breachData.map(item => item.credential),
                details: breachData
            });
        } else {
            breachRecord.emailChecked = true;
            breachRecord.breachFounds = [...new Set([...breachRecord.breachFounds, ...breachData.map(item => item.credential)])];
            breachRecord.details = [...breachRecord.details, ...breachData];
        }
        
        await breachRecord.save(); // acing it to DB...
    } catch (error) {
        console.error('Error updating breach watch record:', error);
    }
}

// BREACH STATS STRUCTURE (breachStats)
// {
//     totalBreach: 9 ,
//     itemsAtRisk : 3 ,
//     resolvedBreaches: 0
// }

// BREACH DATA STRUCTURE (breachData)
// {
//     credential: 'johndoe@example.com',
//     usedIn : 'crypto wallet information',
//     breachCount : 5 ,
//     otherInfo:[
//       'Exposed on: Jan 2023 - Dropbox breach',
//       'Exposed password hash found in leaked database',
//       'Recommended Action: Change your password immediately'
//     ]
// }
export { POST } ;
