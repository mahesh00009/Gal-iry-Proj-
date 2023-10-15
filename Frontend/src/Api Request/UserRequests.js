import axios from 'axios'

const Baseurl = "http://127.0.0.7:5000"

export const Signup =async(user) => {
    const response = await axios.post(`${Baseurl}/register`, user)
    return response
}


export const Login =async(user) => {
    const response = await axios.post(`${Baseurl}/login`, user)
    return response

}


export const Reset =async(user) => {
    const response = await axios.post(`${Baseurl}/reset`, user)
    return response

}

export const getUserInfo = async(token) => {
    const response = await axios.post(`${Baseurl}/sendUser`, {token})

    return response
}
