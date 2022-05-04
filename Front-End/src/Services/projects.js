import axios from "axios";
import { API_URL } from '../Constants';



class projectDataService{

    getAllProjects(token){
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get( `${API_URL}projects/` );
    }

    getAllArchivedProjects(token){
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get( `${API_URL}projects/archived/` );
    }

    getFilterProjects(token, searchObject){
        let queryString = "?";
        const keyList = Object.keys(searchObject);

        keyList.forEach(key => {
            if(searchObject[key] != ""){
                queryString = queryString + key + "=" + searchObject[key] + "&";
            }
        });

        queryString = queryString.slice(0, -1);

        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get( `${API_URL}projects/filter${queryString}` );
    }

    getProject(token, projectNumber) {
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get( `${API_URL}projects/${projectNumber}/` );
    }

    getLinkList(token,linkObject) {
        const JSONLinkObject = JSON.stringify(linkObject);

        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.post( `${API_URL}links/`, JSONLinkObject);
    }

    isProjectNumberUnique(token, projectNumber) {

        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get( `${API_URL}projects/unique/${projectNumber}/` );
    }

    getAssignedProjects(token, projectNumber) {

        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get( `${API_URL}getAssigned/${projectNumber}/` );
    }





    createSales(token, userId, salesObject){
        axios.defaults.headers.common["Authorization"] = "token" + token;

        let salesPostObject={};

        salesObject.map((object, key) => {
            salesPostObject[object["dbTerm"]] = object["value"]
        })

        salesPostObject["userId"] = userId



        return axios.post( `${API_URL}sales/post/`, salesPostObject);
    }

    getAllSales(token){
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get( `${API_URL}sales/` );
    }

    getFilterSales(token, searchObject){
        let queryString = "?";
        const keyList = Object.keys(searchObject);

        keyList.forEach(key => {
            if(searchObject[key] != ""){
                queryString = queryString + key + "=" + searchObject[key] + "&";
            }
        });

        queryString = queryString.slice(0, -1);

        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get( `${API_URL}sales/filter${queryString}` );
    }

    getSale(token, projectNumber) {
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.get( `${API_URL}sales/${projectNumber}/` );
    }




    createProject(token, newProjectObject){
        const JSONProjectObject = JSON.stringify(newProjectObject);

        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.post( `${API_URL}createProject/`, JSONProjectObject);
    }



    updateProject(projectNumber, newProjectObject, newSaleObject, token){

        const tempObject = {
            'projects':newProjectObject,
            'sales':newSaleObject
        };

        const JSONProjectObject = JSON.stringify(tempObject);

        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.put(`${API_URL}update/${projectNumber}/`, JSONProjectObject);
    }


    deleteProject(projectNumber, token){
        axios.defaults.headers.common["Authorization"] = "token" + token;
        return axios.delete(`${API_URL}projects/${projectNumber}`);
    }

}

export default new projectDataService();