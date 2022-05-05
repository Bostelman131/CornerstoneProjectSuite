import axios from "axios";
import { API_URL } from '../Constants';

class userDataService{
    login(data){
        return axios.post(`${API_URL}login/`, data);
    }

    signup(data){
        return axios.post(`${API_URL}signup/`, data);
    }

    getUser(id, token){
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get(`${API_URL}account/${id}/`);
    }

    updateName(user, token, object){
        user.first_name = object["First Name"];
        user.last_name = object["Last Name"];

        axios.defaults.headers.common["Authorization"] = "token" + token;
        axios.put(`${API_URL}account/${user.id}/`, user).then( response => {
            if(response.status == 200){
                object['setError'](false);
                object['setSuccess'](true);
                object["messageFunction"]("Name Updated Successfully");
                object['setActiveUserData'](object['id']);
                object['close']();
            }
            else{
                object['setSuccess'](false);
                object['setError'](true);
                object["messageFunction"]("Failed to update name. Please try again later");
            }
        })
        return true;
    }

    updateContact(user, token, object){

        user.email = object["Email"];
        user.user_phone = object["Phone"];

        axios.defaults.headers.common["Authorization"] = "token" + token;
        axios.put(`${API_URL}account/${user.id}/`, user).then( response => {
            if(response.status == 200){
                object['setError'](false);
                object['setSuccess'](true);
                object["messageFunction"]("Contact Information Updated Successfully");
                object['setActiveUserData'](object['id']);
                object['close']();
            }
            else{
                object['setSuccess'](false);
                object['setError'](true);
                object["messageFunction"]("Failed to update contact information. Please try again later");
            }
        })
        return true;
    }

    updateRoot(user, token, object){
        user.base_url = object["Base URL"];
        user.base_url = user.base_url +'\\';

        axios.defaults.headers.common["Authorization"] = "token" + token;
        axios.put(`${API_URL}account/${user.id}/`, user).then( response => {
            if(response.status == 200){
                object['setError'](false);
                object['setSuccess'](true);
                object["messageFunction"]("Base URL Updated Successfully");
                object['setActiveUserData'](object['id']);
                object['close']();

            }
            else{
                object['setSuccess'](false);
                object['setError'](true);
                object["messageFunction"]("Failed to update base url. Please try again later");
            }
        })
        return true;
    }

    updateProfile(user, token, object){
        let formData = new FormData();
        formData.append('file', object["Profile Picture"]);

        axios.defaults.headers.common["Authorization"] = "token" + token;
        axios.defaults.headers.common["Content-Type"] = object["Profile Picture"].type;
        axios.put(`${API_URL}profilePicture/${user.id}/`,  formData ).then( response => {
            if(response.status == 200){
                object['setError'](false);
                object['setSuccess'](true);
                object["messageFunction"]("Profile Picture Updated Successfully");
                object['setActiveUserData'](object['id']);
                object['close']();

            }
            else{
                object['setSuccess'](false);
                object['setError'](true);
                object["messageFunction"]("Failed to update profil picture. Please try again later");
            }
        })
        return true;
    }

    updateBio(user, token, object){
        user.bio = object["Bio"];

        axios.defaults.headers.common["Authorization"] = "token" + token;
        axios.put(`${API_URL}account/${user.id}/`, user).then( response => {
            if(response.status == 200){
                object['setError'](false);
                object['setSuccess'](true);
                object["messageFunction"]("Bio Updated Successfully");
                object['setActiveUserData'](object['id']);
                object['close']();
            }
            else{
                object['setSuccess'](false);
                object['setError'](true);
                object["messageFunction"]("Failed to update bio. Please try again later");
            }
        })
        return true;
    }

    changePassword(user, token, object){
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        if(object["Password"] == ""){
            object['setSuccess'](false);
            object['setError'](true);
            object["messageFunction"]("Please enter a password.");
            return;
        }

        if(object["Password"] != object["Confirm Password"]){
            object['setSuccess'](false);
            object['setError'](true);
            object["messageFunction"]("These passwords do not match.");
            return;
        }

        if(object["Password"].length < 8){
            object['setSuccess'](false);
            object['setError'](true);
            object["messageFunction"]("Password is too short.");
            return;
        }

        user.password = object["Password"];

        
        axios.defaults.headers.common["Authorization"] = "token" + token;
        axios.put(`${API_URL}changePassword/${user.id}`, user).then( response => {
            if(response.status == 200){
                object['setError'](false);
                object['setSuccess'](true);
                object["messageFunction"]("Password Updated Successfully");
                object['setActiveUserData'](object['id']);
                object['close']();
            }
            else{
                object['setSuccess'](false);
                object['setError'](true);
                object["messageFunction"]("Failed to create password. Make sure your password meets requirements");
            }
        })
        return true;

    }

    createUser(token, userObject){
        const JSONUserObject = JSON.stringify(userObject);
        
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.post(`${API_URL}signup/`, JSONUserObject);
    }

    getProjectManagers(token) {
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get(`${API_URL}projectManagers/`);
    }

    getSalesmen(token) {
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get(`${API_URL}salesmen/`);
    }
}

export default new userDataService();