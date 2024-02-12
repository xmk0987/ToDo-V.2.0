import { useState, useEffect } from 'react';
import { logout } from '../../utils/authentication/logout';

import { getClassrooms, deleteClassroom, setNewActiveClassroom } from "../../services/admin/classroom";
import { useBaseUrl } from '../../utils/providers/urlprovider';
import { getStudents, deleteStudent} from '../../services/student/student';

import { useActiveClassroom } from '../../utils/providers/ActiveClassroomContext';

import AddTodo from './sidebaroptions/AddTodo';
import Members from './sidebaroptions/Members';
import Groups from './sidebaroptions/Groups';
import { useNavigate } from 'react-router-dom';
import Settings from './sidebaroptions/Settings';


const Sidebar = ({todoView, toggleView}) => {

    const {activeClassroom, setActiveClassroom } = useActiveClassroom();

    const [ classrooms, setClassrooms ] = useState([]);
    const [ students, setStudents ] = useState([]);
    const [ currentComponent, setCurrentComponent ] = useState('sidebar-options');

    const navigate = useNavigate();
    const baseURL = useBaseUrl();
    const token = window.localStorage.getItem("token");
    const username = window.localStorage.getItem("username");

    const fetchClassrooms = async () => {
        try {
            const newclassrooms = await getClassrooms(baseURL, token, username);
            setClassrooms(newclassrooms);
        } catch (error) {
            console.error('Error fetching active classroom:', error);
        }
    }

    const handleDeleteClassroom = async (classroom_name) => {
        try {
            const shouldDelete = window.confirm("This will delete everything related to this classroom. Do you want to continue?");
            
            if (shouldDelete) {
              await deleteClassroom(baseURL, token, classroom_name);
              const data = await getClassrooms(baseURL, token, username);
              setClassrooms(data);
              if(classroom_name === activeClassroom.classroom_name){
                if (data.length !== 0) {
                  await setNewActiveClassroom(baseURL, token, username, data[0].classroom_name);
                  setActiveClassroom(data[0]);
                } 
                else {
                    navigate('firstClassroom');
                }
              }
            }
          } catch (error) {
            console.error('Error in deleting classroom: ', error);
          }
    }

    const fetchStudents = async () => {
        try {
            const newstudents = await getStudents(baseURL, token, activeClassroom.classroom_name);
            setStudents(newstudents);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    const handleDeleteStudent = async (username) => {
        try {
            const shouldDelete = window.confirm("Do you want to remove this student?");
            
            if (shouldDelete) {
              await deleteStudent(baseURL, token, username);
              fetchStudents();
            }
          } catch (error) {
              console.error('Error in deleting student: ', error);
          }
    }

    const goBack = () => {
        setCurrentComponent("sidebar-options");
    }

    return (
        <div className="sidebar-container flex-center-column">
            <div className="sidebar-header-container flex-center full-width relative">
                <h1 className="header scroll ">{activeClassroom.classroom_name}</h1>
            </div>
            <div className="sidebar-content-container full-container">
                {currentComponent === 'sidebar-options' ? 
                    <SidebarButtons toggleView={toggleView} 
                    fetchClassrooms={fetchClassrooms} 
                    fetchStudents={fetchStudents}
                    classrooms={classrooms} 
                    students={students}
                    todoView={todoView}
                    setCurrentComponent={setCurrentComponent}/> 
                : 
                currentComponent === 'add-todo' ?
                    <AddTodo goBack={goBack} /> 
                : 
                currentComponent === 'members' ?
                    <Members goBack={goBack} students={students}
                    handleDeleteStudent={handleDeleteStudent}/>
                :
                currentComponent === 'groups' ?
                    <Groups goBack={goBack} classrooms={classrooms} 
                    handleDeleteClassroom={handleDeleteClassroom} />
                : 
                currentComponent === 'settings' ?
                    <Settings goBack={goBack} />
                : null}
            </div>
        </div>
    );
}


const SidebarButtons = ({toggleView, fetchClassrooms, 
    fetchStudents, classrooms, students, 
    todoView, setCurrentComponent}) => {

    const navigate = useNavigate();

    const addTodo = () => {
        setCurrentComponent('add-todo');
    }

    const showMembers = async () => {
        await fetchStudents();
        setCurrentComponent('members')
    }

    const toggleGroupView = () => {
        toggleView();
    }

    const showGroups = async () => {
        if (!classrooms || classrooms.length === 0) {
            await fetchClassrooms();
        }
        setCurrentComponent('groups')
    }

    const openSettings = () => {
        setCurrentComponent('settings')
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <div className='full-container'>
            <div className="first-options">
                {todoView ? <SidebarOption text={"Add Todo"} handleAction={addTodo}/> : null}
                <SidebarOption text={"Members"} handleAction={showMembers}/>
                <SidebarOption text={todoView ? "Group View" : "ToDo View"} handleAction={toggleGroupView} color='make-blue'/>
                <SidebarOption text={"Groups"} handleAction={showGroups}/>
            </div>
            <div className="second-options flex-center-column">
                <SidebarOption text={"Settings"} handleAction={openSettings}/>
                <SidebarOption text={"Logout"} handleAction={handleLogout}/>
            </div>
        </div>
    );
}

export const SidebarOption = ({text, handleAction, color='button-color'}) => {
    return (
        <div className="flex-center full-width">
            <button className={`sidebar-option-button ${color}`} onClick={handleAction}>{text}</button>
        </div>
    );
}

export default Sidebar;