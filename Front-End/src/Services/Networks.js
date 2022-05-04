import axios from "axios";
import { NETWORK_URL } from '../Constants';

class networkDataService{
    getNetworks(token){
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get(`${NETWORK_URL}`)
    }
}

export default new networkDataService();