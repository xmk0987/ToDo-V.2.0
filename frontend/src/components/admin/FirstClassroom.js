import AddNewClassroom from "./sidebaroptions/AddNewClassroom";

const FirstClassroom = () => {
    return (
        <div className="flex-center-column full-container">
            <h1 className="header">ToDo</h1>
            <h2 className="second-header">Create Group</h2>
            <AddNewClassroom usePushNew={false}/>
        </div>
    );
}

export default FirstClassroom;