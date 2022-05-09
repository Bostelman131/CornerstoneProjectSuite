import React, {useEffect, useState} from 'react';
import axios from 'axios';

import {FaClipboardList, FaCaretSquareRight, FaCommentDollar, FaDownload, FaBezierCurve} from "react-icons/fa"; // Icons for Navbar

import './App.css';
import AppHeader from './Header/AppHeader';
import AppNavBar from './Navbar/AppNavbar';
import DisplayWindow from './DisplayWindow/DisplayWindow';
import LoginWindow from './LoginWindow/LoginWindow'
import projectDataService from './Services/projects'
import userDataService from './Services/Users'
import networkDataService from './Services/Networks'
import UserMenu from './UserMenu/UserMenu';
import ProjectView from './ProjectView/ProjectView';

function App() {
  axios.defaults.xsrfCookieName = 'csrftoken'
  axios.defaults.xsrfHeaderName = 'X-CSRFToken'



// LOGIN & LOGOUT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const [ apiToken, setApiToken ] = useState(null); // STORES THE TOKEN FOR API INTERACTION
  const [ admin, setAdmin ] = useState(false);
  const [ salesman, setSalesman ] = useState(false);
  const [ projectManager, setProjectManager ] = useState(false);
  const [ activeUser, setActiveUser ] = useState(""); // STORES ACTIVE USER
  const [ loginLoading, setLoginLoading ] = useState(false) // STORES WHETHER THE LOGIN IS LOADING
  const [ loginError, setLoginError ] = useState(''); // STORES THE ERRORS ASSOCIATED WITH LOGIN
  const [ rememberMe, setRememberMe ] = useState(false);

  async function getUserData(id, setToFunction){  // GETS INFORMATION PERTAINING TO ACTIVE USER
    setSalesman(false);
    setAdmin(false);
    userDataService.getUser(id, apiToken)
      .then(response =>{
        setToFunction(response.data)
        const user = response.data;

        if(user.is_admin == true){
          setAdmin(true);
          setSalesman(true);
          setProjectManager(true);
          console.log("You are an admin. Enjoy the power responsibly!")
        }

        if(user.department.toLowerCase().includes("sales")){
          setSalesman(true);
          console.log("You are a salesman.")
        }

        if(user.job_title.toLowerCase().includes("project manager")){
          setProjectManager(true);
          console.log("You are a project manager.")
        }
      })
      .catch( e => {
        console.log(e)
      })
  }

  const setActiveUserData = (id) =>{  // SET USER INFORMATION FOR ID TO ACTIVE USER - USED AFTER UPDATE OF ACCOUNT SETTINGS
    getUserData(id,setActiveUser);
  }

  if(localStorage['apiToken'] && apiToken === null){  // LOADS API TOKEN AND USER INFORMATION IF CACHED AS COOKIE - REMEMBER ME
    setApiToken(localStorage.getItem('apiToken'));
    getUserData(localStorage.getItem('userID'),setActiveUser);
  }

  async function loginUser(user = null){  // LOGS THE USER IN USING CREDS PROVIDED AND STORES TOKEN
    setLoginLoading(true);

    userDataService.login(user)
      .then(response =>{
        setApiToken(response.data.token);

        if(rememberMe){
          localStorage.setItem('apiToken', response.data.token);
          localStorage.setItem('userID', response.data.id);
        }

        setLoginError('');

        getAll();

        setActiveUserData(response.data.id);

      }).catch( e=> {

        console.log("An error occurred while attempting to fetch active user");
        setLoginError(e.toString());

      });
      
    setLoginLoading(false);
  }

  function logoutUser(){  // LOGS THE USER OUT BY SETTING TOKEN TO NULL - RESETS EVERYTHING IN THE APP BACK TO DEFAULT
    setApiToken(null);
    localStorage.removeItem('apiToken');
    localStorage.removeItem('userID');
    setProjects([]);
    SetuserMenu(false);
    setSelectedNav('Dashboard');
  }

  const loginProps = {  // PROPS - LOGIN  <----------------------------------------
    loginLoading: loginLoading,
    loginError: loginError,
    login: loginUser,
    rememberMe:rememberMe,
    setRememberMe:setRememberMe,
  }



// SEARCH FUNCTIONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  let [ selectedNav , setSelectedNav ] = useState('Dashboard'); // KEEPS TRACK OF SELECTED NAV LINK
  const handleNavClick = (title) => {setSelectedNav(title);} // CHANGES SELECTED NAV LINK
  
  const [ searchTerms, setSearchTerms ] = useState(false);

  const [projectNumber , setProjectNumber] = useState(""); // STATES TO TRACK SEARCHES
  const [clientName, setClientName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [custYear, setCustYear] = useState("");
  const [projectState, setProjectState] = useState("");
  const [managedBy, setManagedBy] = useState("");
  const [projectType, setProjectType] = useState("");
  const [salesStatus, setSalesStatus] = useState("");

  const resetSearches = () => { // SETS ALL SEARCH FIELDS TO ""
    setProjectNumber("");
    setClientName("");
    setCustomerNumber("");
    setCustYear("");
    setManagedBy("");
    setProjectState("");
    setProjectType("");
    setSalesStatus("");
  }
  
  const dropDownOptions = [ // DATA FOR DROP DOWN MENU ON HEADER
    {Label: "Project Number", currentText:projectNumber, SearchBarText:"Enter a project number...", filterFunction:setProjectNumber},
    {Label: "Client's Name", currentText:clientName, SearchBarText:"Enter a client's name...", filterFunction:setClientName},
    {Label:"Customer Number", currentText:customerNumber, SearchBarText:"Enter a customer's name...", filterFunction:setCustomerNumber},
    {Label:"Year", currentText:custYear, SearchBarText:"Enter a year...", filterFunction:setCustYear},
    {Label:"State", currentText:projectState, SearchBarText:"Enter a state abbreviation...", filterFunction:setProjectState},
    {Label:"Managed By", currentText:managedBy, SearchBarText:"Enter an employee's name...", filterFunction:setManagedBy},
    {Label:"Project Type", currentText:projectType, SearchBarText:"Enter a project Type...", filterFunction:setProjectType, select:true, options:["","Project","Maintenance","Warranty"]},
    {Label:"Sales Status", currentText:salesStatus, SearchBarText:"Enter a sales status...", filterFunction:setSalesStatus, select:true, options:["","Sent","Not Sent"]},
  ]

  const homeView = () => {  // TAKES USER BACK TO HOME / DASHBOARD
    setSelectedNav('Dashboard');
  }

  useEffect (()=> {   // IF SELECTED NAV CHANGES, GET ALL IS CALLED
    getAll();

  }, [selectedNav])



// PROJECTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
  const [ results, setResults ] = useState([])  // COMBINATION OF SALES AND PROJECTS TO DISPLAY IN DASHBOARD
  const [ projects, setProjects] = useState([]); // STORES ALL PROJECTS
  const [ sales, setSales ] = useState([]);   // STORES ALL SALES

  const [  projectViewProject, setProjectViewProject ] = useState({});  // STORES PROJECT OBJECT WHEN A TILE IS CLICKED ON
  const [  projectViewSale, setProjectViewSale ] = useState({});  // STORES SALES OBJECT WHEN A TILE IS CLICKED ON

  const checkSearches = () => { // CHECKS TO DETERMINE IF ANY SEARCHES HAVE BEEN MADE - TRUE IF SO - FALSE IF NOT
    let searches = false;

    if(projectNumber != ""){
      searches = true;
    }
    if(clientName != ""){
      searches = true;
    }
    if(customerNumber != ""){
      searches = true;
    }
    if(custYear != ""){
      searches = true;
    }
    if(managedBy != ""){
      searches = true;
    }
    if(projectState != ""){
      searches = true;
    }
    if(projectType != ""){
      searches = true;
    }
    if(salesStatus != ""){
      searches = true;
    }

    return searches
  }

  function getAll() {   // CHECK FOR SEARCHES - IF TRUE - RESET SEARCHES FETCHES PROJECTS  - FALSE - CALL TO GET THEM
    setSearchTerms(false);
    if(checkSearches()){  
      setProjects([]);
      resetSearches();
    }
    else{  

      try{
        if(selectedNav === 'Dashboard'){
          getAllProjects();
          getAllSales();
        }
        if(selectedNav === 'Archived Projects'){
          getAllArchivedProjects();
          setSales([]);
        }
        
        
       }
      catch{
        console.log("Error getting all projects")
      }
    }
  }

  async function getAllProjects(){  // CALLS API TO GET ALL PROJECTS
    projectDataService.getAllProjects(apiToken)
    .then(response =>{
      setProjects(response.data);
    })
    .catch( e => {
      console.log(e);
    })
  }

  async function getAllArchivedProjects(){  // CALLS API TO GET ALL PROJECTS
    projectDataService.getAllArchivedProjects(apiToken)
    .then(response =>{
      setProjects(response.data);
    })
    .catch( e => {
      console.log(e);
    })
  }

  async function getAllSales(){   // CALLS API TO GET ALL SALES OPPS
    projectDataService.getAllSales(apiToken)
      .then(response =>{
        setSales(response.data);
      })
      .catch( e => {
        console.log(e);
      })
  }

  async function getFilteredProject(searchObject) { // CALLS API TO GET FILTERED PROJECTS
    projectDataService.getFilterProjects(apiToken,searchObject)
    .then(response => {
      setProjects(response.data);
    })
    .catch( e => {
      console.log(e);
    })
  }

  async function getFilteredSales(searchObject) { // CALLS API TO GET FILTERED SALES
    projectDataService.getFilterSales(apiToken,searchObject)
    .then(response => {
      setSales(response.data);
    })
    .catch( e => {
      console.log(e);
    })
  }

  function getMyProjects() { // GET ALL PROJECTS OR SALES ASSIGNED TO ACTIVE USER
    setSearchTerms(true);
    homeView();
    resetSearches();
    setProjects([]);

    const searchObject = {
      "id" : activeUser.id,
    }

    getFilteredProject(searchObject);
    getFilteredSales(searchObject);
  }

  function getWatchlistProjects() {  // GET ALL PROJECTS ASSIGNED TO WATCHLIST
    setSearchTerms(true);
    homeView();
    setResults([]);
    setSales([]);
    setProjects([]);
    const tempSearchObject = {
      "watchList": true,
    }
    getFilteredProject(tempSearchObject);
  }

  async function getProjectView(projectNumber) {  // GET A SPECIFIC PROJECT BASED ON ITS PROJECT NUMBER -> STORE TO 'projectViewProject'
    projectDataService.getProject(apiToken, projectNumber)
    .then(response => {
      setProjectViewProject(response.data);
      getSaleView(response.data['sales_number'])
    })
  }

  async function getSaleView(projectNumber) {  // GET A SPECIFIC SALES OPP BASED ON ITS PROJECT NUMBER -> STORE TO 'projectViewSale'
    projectDataService.getSale(apiToken, projectNumber)
    .then(response => {
      setProjectViewSale(response.data);
    })
  }

  const combineResults = () => {    // COMBINE 'projects' & 'sales' -> 'results'
    const tempArray = []

    projects.forEach(record => {
      tempArray.push(record);
    })
    sales.forEach(record => {
      tempArray.push(record);
    })

    setResults(tempArray);
  }

  useEffect (() => {  // FILTER PROJECTS BASED ON SEARCH TERMS - UPDATES ON INPUT CHANGE TO SEARCH FIELDS LISTED
    setResults([]);
    setSearchTerms(checkSearches());

    const searchObject = {
      "projectNumber": projectNumber,
      "clientName":clientName,
      "customerID":customerNumber,
      "projectCreationDate":custYear,
      "projectState":projectState,
      "owner":managedBy,
      "projectType":projectType,
      "salesStatus":salesStatus,
    }

    if(selectedNav === 'Dashboard'){
      searchObject["archived"] = false;
      try{
        getFilteredProject(searchObject);
        getFilteredSales(searchObject);
       }
      catch{
        console.log("Error getting all projects")
      }
    }
    
    if(selectedNav === 'Archived Projects'){
      searchObject["archived"] = true;
      try{
        getFilteredProject(searchObject);
        setSales([]);
       }
      catch{
        console.log("Error getting all projects")
      }
    }

  }, [projectNumber, clientName, customerNumber, custYear, managedBy, projectState, projectType, salesStatus])

  useEffect (() => {  // COMBINES SALES AND PROJECTS WHENEVER ONE CHANGES
    combineResults();
  }, [projects, sales])



 // PROJECT VIEW - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const [ projectOrSale, setProjectOrSale] = useState("")
  const [ projectView, setProjectView ] = useState(false);
  const [ projectLinks, setProjectLinks ] = useState(["","",""]);
  const [ salesLinks, setSalesLinks ] = useState(["","",""]);
  const [ pvProjectNumber, setpvProjectNumber ] = useState("");
  const [ pvSalesNumber, setpvSalesNumber ] = useState("");

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const getNewProjectObject = (selectedProjectManager) => {     // CREATES A NEW PROJECT OBJECT BASED ON INPUT CHANGES IN PROJECT VIEW
    const newProjectObject = {
    'projectNumber': projectViewProject['projectNumber'],
    'projectFilePath': projectViewProject['file_path'],
    'customerID': projectViewProject['sage_number'],
    'archived':projectViewProject['archived'],
    }

    if(selectedProjectManager != "" && selectedProjectManager != projectViewProject.owner){
      newProjectObject['owner'] = selectedProjectManager;
    }
    else{
      newProjectObject['owner'] = projectViewProject.owner_id;
    }

    return newProjectObject;
  }

  const getNewSaleObject = (sale=false, selectedProjectManager=undefined) => {     // CREATES A NEW SALES OBJECT BASED ON INPUT CHANGES IN PROJECT VIEW
    const newSaleObject = {
      'salesNumber': projectViewSale['projectNumber'],
      'clientName': projectViewProject['clientName'],
      'projectName': projectViewProject['projectName'],
      'contactFirstName': projectViewSale['contactFirstName'],
      'contactLastName': projectViewSale['contactLastName'],
      'contactTitle': projectViewSale['contactTitle'],
      'contactPhoneNumber': projectViewSale['contactPhoneNumber'],
      'contactEmail': projectViewSale['contactEmail'],
      'owner':  projectViewSale['owner_id'],
      'projectNarrative':  projectViewSale['projectNarrative'],
      'projectStreet': projectViewSale['projectStreet'],
      'projectCity': projectViewSale['projectCity'],
      'projectState': projectViewSale['projectState'],
      'projectZip': projectViewSale['projectZip'],
      'salesFilePath': projectViewSale['file_path'],
      'submitted': projectViewSale['submitted'],
    }

    if(sale){

      if(selectedProjectManager == "" || selectedProjectManager == undefined){
        newSaleObject['owner'] = projectViewSale['owner_id'];
      }
      else{
        newSaleObject['owner'] = selectedProjectManager
      }
    }

    return newSaleObject;
  }

  const handlePVSubmit = async (setPVSubmitMessage,setPVLoading,setPVError,setPVSuccess,selectedProjectManager) => {  // HANDLES CHANGES MADE IN PROJECT VIEW
    if(projectViewProject['projectNumber'][0].toLowerCase() != 's'){

      if(pvProjectNumber != projectViewProject['projectNumber']){

        projectDataService.isProjectNumberUnique(apiToken,projectViewProject['projectNumber']).then(res => {
          const unique = res.data['unique'];
          if(unique == false){
            setPVError(true);
            setPVSubmitMessage("Update Failure: Please Enter a Unique Project Number...");
          }
          else{
            setPVError(false);
            setPVSubmitMessage("Please Wait... Updating Project Number...");
          }
        })
      }
      setPVSubmitMessage("Please Wait... Updating Project Information...");

      const newProjectObject = getNewProjectObject(selectedProjectManager)
      const newSaleObject = getNewSaleObject()

      projectDataService.updateProject(pvProjectNumber, newProjectObject, newSaleObject, apiToken).then(res => {
        if(res.status == 200){
          setPVError(false);
          setPVSuccess(true);
          setPVSubmitMessage("Project Updated Successfully...");
  
          sleep(1500).then( res => {
            setPVLoading(false);
            setPVSubmitMessage("Please Wait... Loading...");
            handleProjectClick(projectViewProject['projectNumber'], true);
          })
        }
        else{
          setPVError(true);
          setPVSubmitMessage("Update Failure: Unable to change this project at this time, try again later. If this problem persists please contact your administrator.");
  
          sleep(1500).then( res => {
            setPVError(false);
            setPVLoading(false);
            setPVSubmitMessage("Please Wait... Loading...");
          })
        }
      })
    }



    else{
      if(pvSalesNumber != projectViewProject['projectNumber']){
        setPVError(true);
        setPVSubmitMessage("Update Failure: The Sale Number Can Not Be Changed...");

        sleep(1500).then( res => {
          setPVError(false);
          setPVLoading(false);
          setPVSubmitMessage("Please Wait... Loading...");
        })
      }


      else{
        setPVSubmitMessage("Please Wait... Updating Project Information...");
        const newProjectObject = {}
        const newSaleObject = getNewSaleObject(true,selectedProjectManager)

        projectDataService.updateProject(pvSalesNumber, newProjectObject, newSaleObject, apiToken).then(res => {
          if(res.status == 200){
            setPVError(false);
            setPVSuccess(true);
            setPVSubmitMessage("Project Updated Successfully...");
    
            sleep(1500).then( res => {
              setPVLoading(false);
              setPVSubmitMessage("Please Wait... Loading...");
              handleProjectClick(projectViewProject['projectNumber'], true);
            })
          }
          else{
            setPVError(true);
            setPVSubmitMessage("Update Failure: Unable to change this project at this time, try again later. If this problem persists please contact your administrator.");
    
            sleep(1500).then( res => {
              setPVError(false);
              setPVLoading(false);
              setPVSubmitMessage("Please Wait... Loading...");
            })
          }
        })
      }


    }


  }

  const handleCPSubmit = async ( redirect, projectNumber, customerNumber, type, owner, setLoading, setMessage, setError, setSuccess, closeReassignWindow ) => {  // CREATES A NEW PROJECT WHEN 'CONVERT TO PROJECT' FORM WITHIN PROJECT VIEW IS SUBMITTED
    const tempNewProjectObject = {
      'salesNumber' : pvSalesNumber,
      'projectNumber' : projectNumber,
      'customerID' : customerNumber,
      'projectType' : type,
      'owner' : owner,
    }

    projectDataService.createProject(apiToken, tempNewProjectObject).then(response => {
      if(response.status == 200){
        setSuccess(true);
        if(redirect){
          setMessage("Project Created Successfully... Please Wait to be redirected");
        }
        else{
          setMessage("Project Created Successfully... Please continue to archive");
        }       

        sleep(2000).then( res => {
          setLoading(false);
          setMessage("Please Wait... Loading...");

          if(redirect){
            sleep(2000).then( res => {
              const newFilePath = response.data
              window.open('localexplorer:'+activeUser.base_url+newFilePath['newFilePath']);
              setProjectView(false);
              getAll();
            })
          }
          else{
            getAll();
            closeReassignWindow();
          }

        })
      }
      else{
        setError(true);
        setMessage("Project Creation Failed... Please Check the submission information and whether a project folder already exists under that name.");
        
        sleep(1500).then( res => {
          setLoading(false);
          setMessage("Please Wait... Loading...");
        })
      }
    })
  }

  const getProjectLinks = async (link,setFunction) => {   // SETS ALL DIRECTORIES AT A LINK LOCATION TO THE 'setFunction'
    const linkObject = {
      "url": link,
    }

    projectDataService.getLinkList(apiToken, linkObject)
    .then( response => {
      setFunction(response.data);
  })
  }

  const getProjectManagers = async (setToFunction) => {   // LIST OF ALL PROJECT MANAGERS IN SYSTEM AND SETS TO 'setToFunction'
    userDataService.getProjectManagers(apiToken).then( response => {
      setToFunction(response.data['project_managers'])
    })
  }

  const getSalesmen = async (setToFunction) => {   // LIST OF ALL SALESMEN IN SYSTEM AND SETS TO 'setToFunction'
    userDataService.getSalesmen(apiToken).then( response => {
      setToFunction(response.data['project_managers']);
    })
  }

  const getAssignedProjects = async (projectNumber, setToFunction) => {   // LIST OF ALL ASSIGNED PROJECTS GIVEN A PROJECT NUMBER AND SETS TO 'setToFunction'
    if(projectNumber != undefined){
      projectDataService.getAssignedProjects(apiToken,projectNumber).then( response => {
        setToFunction(response.data['assigned']);
      })
    }
  }

  const handleProjectClick = (projectNumber, forcedUpdate=false) => {   // HANDLES A PROJECT TILE CLICK
    
    if(!projectView || forcedUpdate){
      if(projectNumber[0].toLowerCase() != 's'){
        setProjectOrSale("project")
        getProjectView(projectNumber)
        .then( function() {
          setProjectLinks()
        })
        
        .then( function() {
          setProjectView(true);
        })
      }

      else{
        setProjectOrSale("sale")
        getSaleView(projectNumber)
        .then( function() {
          setSalesLinks()
        })
        
        .then( function() {
          setProjectView(true);
        })
      }
    }
  }

  const projectViewProps = { // PROPS - PROJECT VIEW  <----------------------------------------
    fontSize: 28,
    textHeight:20,
    projectViewProject:projectViewProject,
    projectViewSale:projectViewSale,
    setProjectView:setProjectView,
    projectLinks:projectLinks,
    salesLinks:salesLinks,
    activeUser:activeUser,
    pvProjectNumber:pvProjectNumber,
    pvSalesNumber:pvSalesNumber,
    handlePVSubmit:handlePVSubmit,
    getProjectManagers:getProjectManagers,
    getSalesmen:getSalesmen,
    handleProjectClick:handleProjectClick,
    projectOrSale:projectOrSale,
    getAssignedProjects:getAssignedProjects,
    projectManager:projectManager,
    handleCPSubmit:handleCPSubmit,
    isProjectNumberUnique: projectDataService.isProjectNumberUnique,
    apiToken: apiToken,
  }

  useEffect (() => {    // IF 'projectViewSale' CHANGES UPDATE LINKS AND 'pvSalesNumber'
    if(projectViewSale['file_path'] != undefined){
      getProjectLinks(projectViewSale['file_path'],setSalesLinks)
    }

    setpvSalesNumber(projectViewSale['projectNumber'])

  }, [projectViewSale] );

  useEffect (() => {    // IF 'projectViewProject' CHANGES UPDATE LINKS AND 'pvProjectNumber'
    if(projectViewProject['file_path'] != undefined){
      getProjectLinks(projectViewProject['file_path'],setProjectLinks)
    }

    setpvProjectNumber(projectViewProject['projectNumber']);

  }, [projectViewProject] );




// USER MENU - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const [ userMenuWidth, setUserMenuWidth ] = useState(480);
  const [ userMenuToggled, SetuserMenu ] = useState(false);

  function toggleUserMenu() {  // HIDES OR SHOWS THE USER MENU ON RIGHT SIDE
    SetuserMenu(!userMenuToggled);
  }

  const UMQuickLinks = {  // QUICK LINKS - USER MENU
    "My Projects": getMyProjects,
    "Watchlist Projects": getWatchlistProjects,
    
  }

  const UMSettingLinks = [  // ACCOUNT SETTINGS - USER MENU
    {
      "name": "Change My Name",
      "function": userDataService.updateName,
      "fields": ["First Name", "Last Name"],
      "First Name": activeUser.first_name,
      "Last Name": activeUser.last_name,
      "type":"text",
      "height": "25px",
      "textarea": false,
      "tooltip": "",
      "messageFunction" : null,
      "setError": null,
      "setSuccess": null,
    },
    {
      "name": "Update Contact Information",
      "function": userDataService.updateContact,
      "fields": ["Email", "Phone"],
      "Email": activeUser.email,
      "Phone": activeUser.user_phone,
      "type":"text",
      "height": "25px",
      "textarea": false,
      "tooltip": "",
      "messageFunction" : null,
      "setError": null,
      "setSuccess": null,
    },
    {
      "name": "Change My Password",
      "function": userDataService.changePassword,
      "fields": ["Password", "Confirm Password"],
      "Password": "",
      "Confirm Password":"",
      "type":"password",
      "height": "25px",
      "textarea": false,
      "tooltip": 'Your password can’t be too similar to your other personal information.\nYour password must contain at least 8 characters.\nYour password can’t be a commonly used password.\nYour password can’t be entirely numeric.',
      "messageFunction" : null,
      "setError": null,
      "setSuccess": null,
    },
    {
      "name": "Edit Base URL",
      "function": userDataService.updateRoot,
      "fields": ["Base URL"],
      "Base URL": activeUser.base_url,
      "type":"text",
      "height": "25px",
      "textarea": false,
      "tooltip": "Navigate to your sedata folder and copy the path (ctr+c) then paste (ctr+v) into the input window below.",
      "messageFunction" : null,
      "setError": null,
      "setSuccess": null,
    },
    {
      "name": "Change Profile Picture",
      "function": userDataService.updateProfile,
      "fields": ["Profile Picture"],
      "Profile Picture": activeUser.profile_picture,
      "type":"file",
      "height": "25px",
      "textarea": false,
      "tooltip": "Select either a .png or .jpg that is a close crop of your face and as close to a square as possible. (Hint - Use clipping tool)",
      "messageFunction" : null,
      "setError": null,
      "setSuccess": null,
    },
    {
      "name": "Add/Edit User Bio",
      "function": userDataService.updateBio,
      "fields": ["Bio"],
      "Bio": activeUser.bio,
      "type":"textarea",
      "height": "120px",
      "textarea": true,
      "tooltip": "",
      "messageFunction" : null,
      "setError": null,
      "setSuccess": null,
    }
  ]

  const UMAppLink = {  // GENERAL - USER MENU
    "Logout": logoutUser,
  }

  const userMenuProps = { // PROPS - USER MENU  <----------------------------------------
    user: activeUser,
    maxHeight: 100,
    UserMenuWidth: userMenuWidth,
    toggleUserMenu:toggleUserMenu,
    UMQuickLinks:UMQuickLinks,
    UMSettingLinks,UMSettingLinks,
    UMAppLink:UMAppLink,
    token: apiToken,
    setActiveUserData:setActiveUserData,
  }

  

// SEARCH BAR - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const searchbarProps = {  // PROPS - SEARCH BAR  <----------------------------------------
    projectNumber, projectNumber,
    setProjectNumber:setProjectNumber,
    dropDownOptions:dropDownOptions,
    getAll:getAll,

  }



// HEADER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const headerProps = { // PROPS - HEADER  <----------------------------------------
    searchbarProps: searchbarProps,
    user: activeUser,
    maxHeight: 55,
    toggleUserMenu : toggleUserMenu,
    searchTerms: searchTerms,
    getAll: getAll,
  }



// NETWORKING STATUS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const [ networkStatus, setNetworkStatus ] = useState(null); // STORES A JAVASCRIPT OBJECT WITH NAME AND STATUS AFTER GET REQUEST
  const [ networkLoading, setNetworkLoading ] = useState(false);
  const [ networkError, setNetworkError ] = useState("");

  async function getNetworkStatus(){  // ASKS THE SERVER IF THE NETWORK IS STABLE AND STORES INFO TO networkStatus
    setNetworkLoading(true);

    networkDataService.getNetworks(apiToken)
    .then(response =>{
      setNetworkStatus(response.data);
      
      setNetworkLoading(false);
    })
    .catch( e => {
      setNetworkError(e);
      console.log(e);
    })
  }

  const networkProps = { // PROPS - NETWORK DIAG  <----------------------------------------
    networkStatus: networkStatus,
    getNetworkStatus: getNetworkStatus,
    networkLoading: networkLoading,
    networkError: networkError,
  }



 // SALES OPPORTUNITY - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 
  const SalesFormTextHeight = "25px";
  const SalesFormTextAreaHeight = "200px";

  const SalesFormObject = [   // OBJECT USED FOR POPULATING SALES OPP CREATION FORM
    {
      "name": "Client Name",
      "dbTerm": "clientName",
      "placeHolder": "Please enter the client's name...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "25",
    },
    {
      "name": "Project Name",
      "dbTerm": "projectName",
      "placeHolder": "Please enter the project name...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "25",
    },
    {
      "name": "Project Street",
      "dbTerm": "projectStreet",
      "placeHolder": "Please enter a street address...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "25",
    },
    {
      "name": "Project City",
      "dbTerm": "projectCity",
      "placeHolder": "Please enter a city...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "25",
    },
    {
      "name": "Project State",
      "dbTerm": "projectState",
      "placeHolder": "Please enter a state abbreviation...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "2",
    },
    {
      "name": "Zip Code",
      "dbTerm": "projectZip",
      "placeHolder": "Please enter a zip code...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "6",
    },
    {
      "name": "Contact's First Name",
      "dbTerm": "contactFirstName",
      "placeHolder": "Please enter the primary contact's first name...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "15",
    },
    {
      "name": "Contact's Last Name",
      "dbTerm": "contactLastName",
      "placeHolder": "Please enter the primary contact's last name...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "15",
    },
    {
      "name": "Contact's Title",
      "dbTerm": "contactTitle",
      "placeHolder": "Please enter the primary contact's title...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "25",
    },
    {
      "name": "Contact's Phone Number",
      "dbTerm": "contactPhoneNumber",
      "placeHolder": "Please enter the primary contact's phone number...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "10",
    },
    {
      "name": "Contact's Email Address",
      "dbTerm": "contactEmail",
      "placeHolder": "Please enter the primary contact's email...",
      "type":"email",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "40",
    },
    {
      "name": "Project Description",
      "dbTerm": "projectNarrative",
      "placeHolder": "Please enter a brief description...",
      "type":"text",
      "textarea": true,
      "tooltip": "",
      "value": "",
      "maxLength": "1000",
    },
  ]

  const salesDirections = {   // DIRECTIONS FOR HOW TO USE SALES OPP CREATION TOOL
    "title":"General Directions",
    "primary": "To create a new sales opportunity within Cornerstone Project Suite, please fill out the form with correct information. Information entered incorrectly on this form will create issues within the folder structure that require manual edits. Once all fields within the form have been correctly entered, please click on the Submit button at the bottom of the form. If all fields are validated, a new sales opportunity will be created within the database and the folder structure will be updated accordingly. After successful creation of the sales opportunity you should be automatically redirected to open the newly created sales folder. If for any reason this portal doesn't operate as intended, please contact your system administrator."
  }

  const salesOppProps = { // PROPS - SALES OPPORTUNITY <----------------------------------------
    SalesFormObject:SalesFormObject,
    user: activeUser,
    salesFormTextHeight: SalesFormTextHeight,
    salesFormTextAreaHeight: SalesFormTextAreaHeight,
    homeView:homeView,
    salesDirections:salesDirections,
    token: apiToken,
    createSales: projectDataService.createSales,
    getAll:getAll,
  }

  

 // CREATE USER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 
 const createUserTextHeight = "25px";

 const createUserFormObject = [   // OBJECT USED FOR POPULATING USER CREATION FORM
    {
      "name": "First Name",
      "dbTerm": "first_name",
      "placeHolder": "Please enter the user's first name...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "20",
    },
    {
      "name": "Last Name",
      "dbTerm": "last_name",
      "placeHolder": "Please enter the user's last name...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "20",
    },
    {
      "name": "Email",
      "dbTerm": "email",
      "placeHolder": "Please enter the user's email address...",
      "type":"email",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "60",
    },
    {
      "name": "Job Title",
      "dbTerm": "job_title",
      "placeHolder": "Please enter the user's job title...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "25",
    },
    {
      "name": "Department",
      "dbTerm": "department",
      "placeHolder": "Please enter the user's department...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "25",
    },
    {
      "name": "Phone Number",
      "dbTerm": "user_phone",
      "placeHolder": "Please enter the user's phone number...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "10",
    },
    {
      "name": "Admin",
      "dbTerm": "is_admin",
      "placeHolder": "Is the user an admin?",
      "type":"checkbox",
      "textarea": false,
      "tooltip": "",
      "value": false,
      "maxLength": "10",
    },
    {
      "name": "Password",
      "dbTerm": "password",
      "placeHolder": "Please enter the user's default password or leave blank for CDP001...",
      "type":"text",
      "textarea": false,
      "tooltip": "",
      "value": "",
      "maxLength": "100",
    },
  ]

 const createUserDirections = {   // DIRECTIONS FOR HOW TO USE USER CREATION TOOL
   "title":"General Directions",
   "primary": "To create a new user within Cornerstone Project Suite, please fill out the form with correct information. The user's email will be used to sign in to the app with the password provided, please record this information in the event that the auto-notifier within Cornerstone Project Suite fails to successfully notify the user of the account creation. The phone number field on the form is to be 10 digits without any seperating characters. Admin field denotes whether the user is to have special abilites within the app that allows them maximum control. Be cautious of who has this privilege. After the form has been completed, click the submit button to add the user to the Cornerstone Suite System."
 }

 const createUserProps = { // PROPS - CREATE USER <----------------------------------------
  createUserFormObject:createUserFormObject,
   user: activeUser,
   createUserTextHeight: createUserTextHeight,
   token: apiToken,
   homeView:homeView,
   getAll:getAll,
   createUserDirections:createUserDirections,
   createUser: userDataService.createUser,

 }


// DASHBOARD - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const dashboardProps = { // PROPS - DASHBOARD <----------------------------------------
    projects: results,
    user: activeUser,
    handleProjectClick:handleProjectClick,
  }


// PRIMARY & SECONDARY WINDOW PROPS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const displayWindowProps = { // PROPS - DISPLAY WINDOW  (PRIMARY) <----------------------------------------
      navSelected: selectedNav,
      projects: projects,
      maxHeight: 40,
      user: activeUser,
      dashboardProps: dashboardProps,
      networkProps: networkProps,
      salesOppProps:salesOppProps,
      createUserProps:createUserProps,
    }

    const NavLinkList = [ // ICONS AND TITLES FOR NAVBAR LINKS (SECONDARY)
      {DashIcon: FaClipboardList,title: "Dashboard"},
      {DashIcon: FaDownload,title: "Archived Projects"},
    ]

    if(admin || salesman){  // SHOW 'CREATE SALES OPPORTUNITY' IF SALESMAN OR ADMIN
      NavLinkList.push({DashIcon: FaCommentDollar,title: "Create Sales Opportunity"})
    }

    if(admin){  // SHOW 'CREATE USER' IF SALESMAN OR ADMIN
      NavLinkList.push({DashIcon: FaCaretSquareRight,title: "Create A User"})
    }

    NavLinkList.push({DashIcon: FaBezierCurve,title: "Network Diagnostics"})   // SHOW 'NETWORK DIAGNOSTICS' - LAST TO ORDER LIST PROPERLY

    const navBarProps = { // PROPS - NAVBAR (SECONDARY)  <----------------------------------------
      NavList: NavLinkList,
      navSelected: selectedNav,
      handleClick: handleNavClick
    }



// RENDERING APP - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  if(apiToken == null ){  // IF NO TOKEN IS FOUND PROMPT LOGIN
    return (
      <div className="App">
        <LoginWindow {...loginProps} />
      </div>
    )
  }

  else{   // LOGIN TOKEN FOUND AND RENDER APP

    return (
      <div className="App">

          <AppHeader {...headerProps}/>

          <div className='Primary-Window'>

            <AppNavBar className='App-Navbar' {...navBarProps}/>

            <DisplayWindow className='Display-Window' {...displayWindowProps}/> 

            { userMenuToggled &&
              <UserMenu className='User-Menu' {...userMenuProps}/>
            }

            { projectView &&
              <ProjectView {...projectViewProps} />
            }

          </div>

      </div>
    );

  }

}

export default App;