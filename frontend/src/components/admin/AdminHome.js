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

    const toggleView = () => {
        setTodoView(!todoView);
        localStorage.setItem('todoView', JSON.stringify(!todoView));
    };

    return (
        <div className='home-container full-container'>
            <Mainview todoView={todoView} />
            <Sidebar toggleView={toggleView} 
                    todoView={todoView} 
            />
        </div>
    );
}

export default AdminHome;