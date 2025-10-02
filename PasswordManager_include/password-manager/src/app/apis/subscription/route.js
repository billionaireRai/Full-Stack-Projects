import asyncErrorHandler from "@/middlewares/errorMiddleware";
import users from "@/db/models/userModel";
import { connectWithMongoDB } from "@/db/dbConnection";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeGivenJWT } from "@/lib/decodejwt";

const GET = asyncErrorHandler( async () => { 
    console.log("Route handler for fetching the subscription level triggered...");
    // logic for decodeing the accessToken...
    const cookiesStore = await cookies() ;
    const accessToken = cookiesStore.get("accessToken");
    const decodedToken = await decodeGivenJWT(accessToken.value,process.env.SECRET_FOR_ACCESS_TOKEN);

    // some checking steps...
    if (!decodedToken) {
        console.log("Unauthorized user trying to access this Route...");
        return new NextResponse("Unauthorized user trying to access this Route...", { status: 401 });
    }

    await connectWithMongoDB();  // getting connected with mongoDB...
    const userDocument = await users.findById(decodedToken.id); // getting the user from DB...
    if (!userDocument) {
        console.log("User not found in the database...");
        return new NextResponse("User not found in the database...", { status: 404 });
    }
    const { subscriptionLevel } = userDocument.subscription ; // destructuring the feilds in subscription...
    return NextResponse.json({message:'Subscription level successfully fetched...',subscriptionLevel:subscriptionLevel},{status:200});
    
})


const PATCH = asyncErrorHandler(async (request) => {
    const { planToDownGrade } = await request.json() ; // getting to which user to get downgraded....
    console.log("Route handler for updating the subscription level triggered...");
    // logic for decodeing the accessToken...
     // logic for decodeing the accessToken...
    const cookiesStore = await cookies() ;
    const accessToken = cookiesStore.get("accessToken");
    const decodedToken = await decodeGivenJWT(accessToken.value,process.env.SECRET_FOR_ACCESS_TOKEN);
    // handling some edge cases...
    if (!decodedToken) {
        console.log("Unauthorized user trying to access this Route...");
        return new NextResponse("Unauthorized user trying to access this Route...", { status: 401 });
    }
    // getting connected with mongoDB...
    await connectWithMongoDB();
    const userDocument = await users.findById(decodedToken.id); // getting the user from DB...
    if (!userDocument) {
        console.log("User not found in the database...");
        return new NextResponse("User not found in the database...", { status: 404 });
    }
    // logic for updating the subscription level...
    var { subscriptionLevel , isSubscribed } = userDocument.subscription ;
    if (!isSubscribed || (subscriptionLevel === 'freemium')) {
        console.log("User is not subscribed , hence can't DownGrade his plan...");
        return new NextResponse("User is not subscribed , hence can't DownGrade his plan...", {status: 400});
    }
    // logic for updating the subscription level...
    if (planToDownGrade === 'freemium') {
        userDocument.subscription.isSubscribed = false ;
        userDocument.subscription.subscriptionLevel = planToDownGrade ;
        await userDocument.save() ; // saving the changes in DB doc...
        return NextResponse.json({message:'Subscription level successfully downgraded to FREE plan...'},{status:200});
    }
    // Schedule the downgrade for the end of the current billing cycle.
    // Update the database to reflect pending downgrade.
    // Send a confirmation notification/email.
    userDocument.subscription.subscriptionLevel = planToDownGrade ;
    await userDocument.save() ; // saving the changes in DB doc...
    return NextResponse.json({message:'Subscription level successfully downgraded...'},{status:200});
})

const POST = asyncErrorHandler(async(request) => { 
    const { currentPlan } = await request.json();
    console.log('Current Plan :',currentPlan);
    console.log("Route of subscription cancellation executed...");


    // Logic:
    // If confirmed:
    // Cancel subscription via payment provider's API.
    // Schedule access removal at the end of the billing cycle or immediately (based on policy).
    // Update subscription status in database (canceled or pending_cancel).
    // Send email confirming cancellation and when access will end.
    // Optionally show reactivation option before final access termination.

    return NextResponse.json({message: 'Subscription cancelled successfully !!'},{status:200});
})

export { GET , PATCH , POST} ;