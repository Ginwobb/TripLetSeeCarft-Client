import axios from "axios"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware";

const useUserStore = create(persist((set,get)=>({
    user: null,
    token:'',
    role:'',

    login: async(input)=>{
        const result = await axios.post('http://localhost:8080/auth/login',input)
        console.log(result.data)
        set({user:result.data.user,
            token:result.data.token,
            role:result.data.role})
        return result
    },
    logout: async()=>{
        localStorage.clear()
        set({user:null,token:'',role:''})
    },

    register: async(input)=>{
        const result = await axios.post('http://localhost:8080/auth/register',input)
        console.log(result.data)
        return 
    },
    fetchUser: async () => {
        try {
            const token = get().token;
            const response = await axios.get('http://localhost:8080/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                set({ user: response.data.user });
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    },

    updateUser: async (updatedData) => {
        try {
            const token = get().token; 
            const response = await axios.put('http://localhost:8080/users/me', updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                set({ user: response.data.user }); 
            }
        } catch (error) {
            console.error('Error updating user info:', error);
        }
    },
}),
{
    name:'user-store',
    storage:createJSONStorage(() => localStorage)
}))

export default useUserStore
