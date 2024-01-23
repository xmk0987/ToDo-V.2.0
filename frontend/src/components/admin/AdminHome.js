import { useState, useEffect } from 'react';


import Sidebar from './SidebarAdmin';
import Mainview from './Mainview';

import '../../styles/admin/views.css';
import '../../styles/admin/sidebar.css';
import '../../styles/admin/navbar.css';
import '../../styles/todo.css'


const AdminHome = () => {
    const initialTodoViewState = JSON.parse(localStorage.getItem('todoView'));
    const [todoView, setTodoView] = useState(initialTodoViewState);
    const [showSidebar, setShowSidebar] = useState(true);

    const toggleView = () => {
        setTodoView(!todoView);
        localStorage.setItem('todoView', JSON.stringify(!todoView));
    };

    return (
        <div className='home-container full-container relative'>
            <button className='sidebar-menu-button' onClick={() => setShowSidebar(!showSidebar)}><ion-icon name="menu-outline"></ion-icon></button>
            <Mainview todoView={todoView} />
            {showSidebar ? <Sidebar toggleView={toggleView} 
                    todoView={todoView}/>  
            : null}
            
        </div>
    );
}

export default AdminHome;