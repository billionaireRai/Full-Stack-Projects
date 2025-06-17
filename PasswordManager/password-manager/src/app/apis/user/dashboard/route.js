import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/db/dbConnection";
import { decodeGivenJWT } from "@/lib/decodejwt";
import users from "@/db/models/userModel";
import vaultitems from "@/db/models/vaultModel";
import sharedvaults from "@/db/models/sharedVaultModel";
import breachwatchs from "@/db/models/breachWatchModel";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import { cookies } from "next/headers";



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
 
    // each month has 4 weeks...
    for (let week = 1; week <= 4; week++) {
        const weekStart = new Date(currentYearBreach, currentMonth, (week - 1) * 7 + 1);
        const weekEnd = new Date(currentYearBreach, currentMonth, week * 7);
        const count = await breachwatchs.countDocuments({
            userId: decodedUser.id,
            breachDate: { $gte: weekStart, $lt: weekEnd }, // will change according to the breach details fetched from API...
            breachFound: true
        });
        breachTrendData.push({ name: `Week ${week}`, breaches: parseInt(count) }); // pushing...
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

    // each vault takes 400 byte units, total available 100 units
    const usedStorage = (totalVaults * 400 )/1024 ; // data will come in 'MB';
    const { isSubscribed , subscriptionLevel } = await (users.find({_id:decodedUser.id})).subscription ; // destructuing from subscription object..
    const levelInString = String(subscriptionLevel).toLowerCase() ;
    if (!isSubscribed) {
        var storageLimit = 20 * 1024 * 1024 ; // 20MB
    } else {
        if (levelInString === 'basic'){
            var storageLimit = 40 * 1024 * 1024 ; // 40MB
        } else if(levelInString === 'standard'){
            var storageLimit = 70 * 1024 * 1024 ; // 70MB
        } else {
            var storageLimit = 100 * 1024 * 1024 ; // 100MB
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


const GET = asyncErrorHandler( async (request) => {
    
})

export { POST }