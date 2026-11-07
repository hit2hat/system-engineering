import { useState } from 'react';
import Users from '../screens/Users';
import { View } from '@vkontakte/vkui';
import UserCreate from '../screens/UserCreate';

const Admin = ({ id, openView }) => {
    const [ activePanel, setActivePanel ] = useState('users');

    return (
        <View id={id} activePanel={activePanel}>
            <Users
                id="users"
                openView={openView}
                openPanel={setActivePanel}
            />
            <UserCreate
                id="user-create"
                openView={openView}
                openPanel={setActivePanel}
            />
        </View>
    );
};

export default Admin;
