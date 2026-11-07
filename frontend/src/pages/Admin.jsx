import { useState } from 'react';
import Users from '../screens/Users';
import { View } from '@vkontakte/vkui';
import UserCreate from '../screens/UserCreate';
import UserChangePassword from '../screens/UserChangePassword';

const Admin = ({ id, openView }) => {
    const [ selectedUser, setSelectedUser ] = useState(null);
    const [ activePanel, setActivePanel ] = useState('users');

    return (
        <View id={id} activePanel={activePanel}>
            <Users
                id="users"
                openView={openView}
                openPanel={setActivePanel}
                selectUser={setSelectedUser}
            />
            <UserCreate
                id="user-create"
                openView={openView}
                openPanel={setActivePanel}
            />
            <UserChangePassword
                id="user-change-password"
                selectedUser={selectedUser}
                openView={openView}
                openPanel={setActivePanel}
            />
        </View>
    );
};

export default Admin;
