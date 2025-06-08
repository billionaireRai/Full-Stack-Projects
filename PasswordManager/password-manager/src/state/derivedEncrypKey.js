// this is a file managing the state of users derived encryption...
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserDerivedEncryptionKey = create( persist((set) => {
    return {
    encryptionKeyValue : null , // state variable holding the value of encryptionKey...
    // function for setting it...
    setEncryptionKeyValue : (encryptionKeyValue) =>{
        set({encryptionKeyValue})
    },
    // function for resetting it on user logout...
    resetEncryptionKeyValue : () =>{
        set({encryptionKeyValue : null})
    }
},
{
        name: 'user-encryptionkey-stored',
}
}));
export default useUserDerivedEncryptionKey;