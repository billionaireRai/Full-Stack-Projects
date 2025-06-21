import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/db/dbConnection";
import { decodeGivenJWT } from "@/lib/decodejwt";
import { cookies } from "next/headers";
import { generateVaultReport } from '@/lib/pdfGenerator.js'
import { calculateObjectSize } from 'bson';
import fs from 'fs/promises';
import path from "path";
import users from "@/db/models/userModel";
import vaultitems from "@/db/models/vaultModel";
import sharedvaults from "@/db/models/sharedVaultModel";
import breachwatchs from "@/db/models/breachWatchModel";
import auditlogs from "@/db/models/auditModel";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import axios from "axios";


const POST = asyncErrorHandler( async (request) => {
    const { method } = await request.json() ; // extracting the method by which the data is coming...
    console.log(`Data requested my ${method} method...`);
    
    // extracting the user data from cookies already ,verifed by authMiddleware...
    const cookieStore = await cookies() ;
    const accessToken = cookieStore.get('accessToken') ; // reaching the main acceToken by acceToken.value
    const decodedUser = decodeGivenJWT(accessToken.value,process.env.SECRET_FOR_ACCESS_TOKEN) ; // calling the lib function..

    await connectWithMongoDB() // establishing the connection with mongoDB..

    // Fetch vaults for the user
    const userVaults = await vaultitems.find({ userId: decodedUser.id }); // will return an array of vaults of this user...
    // Calculate topInformation
    const totalVaults = userVaults.length ; // one of the information required...
    const itemsStored = userVaults.reduce((acc, vault) => {
        // encryptedCurrentData is an object with keys representing items...
        if (vault.encryptedCurrentData && typeof vault.encryptedCurrentData === 'object') {
            return acc + Object.keys(vault.encryptedCurrentData).length; 
        }
        return acc; // returning the total number of items...
    }, 0); // inital accumulator is 0...

    // For shared vaults...
    const sharedVaultsCount = await sharedvaults.countDocuments({ ownerId: decodedUser.id });

    // For breach alerts...
    const activeBreachAlertsCount = await breachwatchs.countDocuments({ userId: decodedUser.id, breachFound: true }); 
    const topInformation = [
        { label: 'Total Vaults', value: parseInt(totalVaults) },
        { label: 'Items Stored', value: parseInt(itemsStored) },
        { label: 'Shared Vaults', value: parseInt(sharedVaultsCount) },
        { label: 'Breach Alerts', value: parseInt(activeBreachAlertsCount) + ' Active', valueClass: 'text-red-600 dark:text-red-400' },
    ];

    // count vaults created per month in current year...
    const vaultUsageData = [];
    const currentYear = new Date().getFullYear(); // pulling current year...
    for (let month = 0 ; month < 12 ; month++) {
        const count = userVaults.filter(vault => {
            const createdAt = vault.createdAt || vault._id.getTimestamp(); // time of creation of a paticular vault...
            return createdAt.getFullYear() === currentYear && createdAt.getMonth() === month;
        }).length;
        const monthName = new Date(currentYear, month).toLocaleString('default', { month: 'short' }); // getting the month name for sending...
        vaultUsageData.push({ name: monthName, count:count }); // pushing the data in the main ARRAY...
    }

    // count by vaultType private/shared...
    const privateVaultCount = totalVaults - sharedVaultsCount; // normal summation logic...
    const vaultTypeData = [
        { name: 'Private', value: privateVaultCount },
        { name: 'Shared', value: sharedVaultsCount },
    ];

    // weekly breaches from breachwatchs for current month...
    // count breaches per week in current month
    const breachTrendData = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYearBreach = now.getFullYear();
 
    // each year has 12 months ...
    for (let month ; month < 12; month++) {
        const monthStart = new Date(currentYearBreach, currentMonth, (month  - 1) * 30 + 1);
        const monthEnd = new Date(currentYearBreach, currentMonth,  month * 30);
        const count = await breachwatchs.countDocuments({
            userId: decodedUser.id,
            breachDate: { $gte: monthStart, $lt: monthEnd}, // will change according to the breach details fetched from API...
            breachFound: true
        });
        breachTrendData.push({ name: `Month ${month}`, breaches: parseInt(count) }); // pushing...
    }

    // categoryData: count by category - mapping vaultType to categories
    const categoryMap = {
        'password-details': 'Passwords',
        'bank-account': 'Bank Info',
        'cryptowallet-details': 'IDs',
        'credit-card': 'Notes',
        'other':'credentials '
    };
    const categoryCounts = {};
    userVaults.forEach(vault => {
        const category = categoryMap[vault.vaultType] ;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name:name, value:value }));

    // getting the storage of all the vaults...
    const totalVaultStorage = userVaults.reduce((acc, vault) => acc + calculateObjectSize(vault.encryptedCurrentData), 0); // getting accual size of the vault...

    // main storage logic...
    const usedStorage = (totalVaultStorage)/1024 ; // data will come in 'MB';
    const user = await users.findById(decodedUser.id);
    const { isSubscribed , subscriptionLevel } = user.subscription ; // destructuring from subscription object..
    const levelInString = String(subscriptionLevel).toLowerCase() ;
    if (!isSubscribed) {
        var storageLimit = 20 * 1024 * 1024 ; // 20MB
    } else {
        if (levelInString === 'basic'){
            var storageLimit = 40 * 1024 * 1024 ; // 60MB
        } else if(levelInString === 'standard'){
            var storageLimit = 70 * 1024 * 1024 ; // 100MB
        } else {
            var storageLimit = 100 * 1024 * 1024 ; // 150MB
        } 
    }
    const availableStorage = Math.max(storageLimit - usedStorage, 0) ; // it cant go below to zero...
    const storageData = [
        { name: 'Used', value: usedStorage, fill: '#8884d8' },
        { name: 'Available', value: availableStorage, fill: '#d0d0d0' },
    ];

    return NextResponse.json({
        topInformation,
        vaultUsageData,
        vaultTypeData,
        breachTrendData,
        categoryData,
        storageData,
    });
})


// handler handling logic related to HIBP to DB...
const PUT = asyncErrorHandler( async (request) => {
        const incomingRequestMethod = request.method ; // verifiying the request method used for this route...
        console.log("Breach Update handler called",incomingRequestMethod);

        // cookies and JWT logic... 
        const cookieStore = await cookies() ;
        const accessToken = cookieStore.get('accessToken').value;
        const decodedUser = decodeGivenJWT(accessToken,process.env.SECRET_FOR_ACCESS_TOKEN) ;

        const HIBP_URI = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(decodedUser.email)}?truncateResponse=false`;
        const HIBP_API_RESPONSE = await axios.get(HIBP_URI , { headers: { 
            'hibp-api-key': process.env.HIBP_API_KEY,
            'user-agent': process.env.APP_NAME,
        }}) ;

        const exactData = HIBP_API_RESPONSE.data ; // getting the data section...
        if (!exactData || exactData.length === 0) {
            console.log(`No Breach Found for this ${decodedUser.email} emailID.`)
            return NextResponse.json({ message: 'No breach found for this email.' }, { status: 200 });
        }

        const { IsVerified: emailChecked, DataClasses: breachFounds, Name: breachName, BreachDate: breachDate, Description: breachDescription, Domain: breachLink, PwnCount: pwnCount, LogoPath: logoPath } = exactData[0]; // destructuring the required data for our record...

        // will automatically create new doc if its first time breach pushing in DB...
        await breachwatchs.findOneAndUpdate(
            { userId: decodedUser.id },
            {
                $set: {
                    emailChecked,
                    breachFounds,
                    details: {
                        breachName,
                        breachDate,
                        breachDescription,
                        breachLink,
                        pwnCount,
                        logoPath
                    }
                }
            },
            { upsert: true } // update the doc if already exists , otherwise create one... 
        );
        console.log("Breach data upserted in DB...");
        return NextResponse.json({ message: 'DB Breach Update successful...' }, { status: 200 });
})

const PATCH = asyncErrorHandler ( async (request) => {
    const method = request.method ; // detecting the request method...
    const { isAuthenticated , reportGeneratedFrom } = await request.json() ; // authentication state of user coming from client...
    console.log("vault-report-generation handler triggered by method :",method);
    console.log("Authentication state coming from client :",isAuthenticated);

    if (!isAuthenticated){
        console.log("Authentication failed from Client Variable...");
        return NextResponse.json({ message: 'Authentication failed from Client Variable...' }, { status: 401 })
    }
    await connectWithMongoDB(); // connecting to mongodb...

    // cookies and JWT handling...
    const cookieStore = await cookies() ;
    const accessToken = cookieStore.get('accessToken').value;
    const decodedUser = decodeGivenJWT(accessToken,process.env.SECRET_FOR_ACCESS_TOKEN) ;
    const userWhoseReport = await users.findById(decodedUser.id) ; // getting the user by ID... 

    // getting all the relevent data from DB for REPORT...
    const userVaults = await vaultitems.find({userId:decodedUser.id}) ; // getting all user vaults...
    // main report generation starts here by creating a pdfdoc...
    const pdfBuffer = await generateVaultReport(userVaults, userWhoseReport);
    // writting this pdf buffer in a file of our project...
    const filePath = path.join(process.cwd(), 'public', 'vault-report.pdf'); // .cwd() current working directory...
    await fs.writeFile(filePath, pdfBuffer); // writing pdf in file...

    // Extract IP address from headers
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    // Extract user-agent from headers
    const userAgent = request.headers.get('user-agent') || 'unknown';
    // log the action in auditlog...
    const newAuditLog = auditlogs({
        userId: decodedUser.id,
        action: 'Vault Report Generation',
        ipAddress: ipAddress, // setting the IP address of the device by which action is made...
        userAgent: userAgent,
        locationOfAction: reportGeneratedFrom
    });
    console.log("Audit Log created for Vault Report Generation...");
    await newAuditLog.save() ; // saving it to the database...

    //  Return as downloadable PDF...
    return NextResponse(pdfBuffer, {
        status: 200,
        headers: {
            'Content-Disposition': `attachment; filename="vault-report.pdf"`,
            'Content-Type': 'application/pdf',
        }
    });

}) 

const GET = asyncErrorHandler( async (request) => {
    const method = request.method ; // detecting the request method...
    // cookies , JWT and user authorization handling
    const cookieStore = await cookies() ;
    const accessToken = cookieStore.get('accessToken').value;
    const decodedUser = decodeGivenJWT(accessToken,process.env.SECRET_FOR_ACCESS_TOKEN) ;
    const userInfoInToken = await users.findById(decodedUser.id) ; // getting the user by ID... 
    
    // making a empty array...
    var recentActivity = [] ;
    // getting all the recent activity of the user from DB...
    const allActivitiesOfUser = await auditlogs.find({userId:userInfoInToken.id}) ; // return an array of user audits accross the app...
    // looping through all the activities of the user and adding them to recentActivity.
    allActivitiesOfUser.forEach((activity) => {
        // checking for activities last 30 days only...
        const currentTime = new Date() ; // current time
        const creationDateInMs = new Date(activity.createdAt) ; // converting in redable date...
        const time = creationDateInMs.getTime() ; // current...
        const oneMonthAgo = currentTime - (30 * 24 * 60 * 60 * 1000) ; // ms 30 days before...

        if (time > oneMonthAgo)  { 
           const place = activity.locationOfAction ? (activity.locationOfAction.addressText?.name || `${activity.locationOfAction.latitude},${activity.locationOfAction.longitude}`)
             : 'Unknown location';
           const objectToPush = {
               action:activity.action,
               when:(activity.createdAt).toUTCString(),
               place: place,
               ip:activity.ipAddress,
           }
           recentActivity.push(objectToPush) ; // pushing it to main array...
        };
    })
    // setting 200 response...
    return NextResponse.json({ message: 'User Activities successfully updated...', recentActivity:recentActivity }, { status:200})

})

export { POST , PUT , PATCH , GET} ;