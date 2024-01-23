
import { SidebarOption } from "../SidebarAdmin";

import { useBaseUrl } from "../../../utils/providers/urlprovider";

import {deleteUser} from '../../../services/user/admin';
import { logout } from "../../../utils/authentication/logout";

const Settings  = ({goBack}) => {
    const username = window.localStorage.getItem("username");
    const token = window.localStorage.getItem("token");
    const baseURL = useBaseUrl();

    const handleDelete = async () => {
        const deleteConfirmation = window.confirm("Are you sure you want to delete this user?");
        if(deleteConfirmation) {
          try {
            await deleteUser(baseURL, token, username);
            logout();
          } catch (error) {
            console.error('Error in deleting students:', error);
          }
        }
    }

    return (
        <div className="full-container">
            <div className="flex-just-center-column padding-top first-options">
                <SidebarOption text={"Delete User"} handleAction={handleDelete} color="make-red"/>
            </div>
            <div className="second-options flex-center-column">
                <SidebarOption text={"Back"} handleAction={goBack} />
            </div>
        </div>
    );
}

export default Settings;