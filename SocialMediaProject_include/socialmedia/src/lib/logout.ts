// function handling api for account logout...
import toast from "react-hot-toast"
import axiosInstance from "./interceptor"

export const handleLogoutAccountLogic = async (accountHandle:string) => { 
    const loadingToast = toast.loading('logging out please wait..') ; // initializing the toast...
    try {
      const logoutapi = await axiosInstance.post('/api/auth/logout',{ accountHandle:accountHandle });
      if (logoutapi.status === 200) {
        localStorage.clear() ; // clearing the localstorage...
        toast.dismiss(loadingToast);
        toast.success('logged out !!');
        window.location.href ='/auth/log-in?logout=true' ;
      } else {
        toast.dismiss(loadingToast);
        toast.error('logout failed from server !!');
      }
    } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('An error occured...');
    }
}