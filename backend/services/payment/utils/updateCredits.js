import axios, { AxiosError } from "axios"
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL

/**
 * @addCredits
 * @param {*} userId 
 * @param {*} amount 
 * @returns 
 */
export const addCredits = async (userId, amount) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/add-credits`, { userId, amount }, {
            headers: {
                "x-internal-api-key": process.env.INTERNAL_SERVICE_KEY,
            },
        });
        if (response.status !== 200) throw new Error(response.data.message);
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) return error?.response?.data.message;
        else return error.message
    }
}
