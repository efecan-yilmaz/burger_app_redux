import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-app-3418c.firebaseio.com/'
});

export default instance;