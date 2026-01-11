// function getting latest account info for any account...
import axiosInstance from "./interceptor"
import { userCardProp } from "@/app/states/useraccounts";

export const getlatestprofileInfo = async (handle:string) => {
    try {
      const profileRes = await axiosInstance.get(`/api/profile?handle=${handle}`) ; // making request to profile api...
      if (profileRes.status === 200) {
        const data : userCardProp = profileRes.data.accountData ; // extracting the data...
        return data ;
      }
      return 'failed' ;
    } catch (error) {
      console.log('Error in getting profile Info :',error);
      return 'failed' ;
    }
}
