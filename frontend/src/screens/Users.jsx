import User from '../component/User';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Icon28AddOutline } from '@vkontakte/icons';
import { Panel, PanelHeader, PanelHeaderBack, PanelHeaderButton, PanelSpinner, Group } from '@vkontakte/vkui';

const Users = ({ id, openView }) => {
    const [ loaded, setLoaded ] = useState(false);
    const [ users, setUsers ] = useState([]);
    const accessToken = useSelector((store) => store.auth.accessToken);

    const refreshUsers = () => {
        return fetch('http://localhost:8080/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((tasks) => {
                setUsers(tasks);
                setLoaded(true);
            })
            .catch(() => null);
    };

    // const actionTask = (id) => {
    //     return fetch('http://localhost:8080/api/task', {
    //         method: 'PUT',
    //         headers: {
    //             'Authorization': `Bearer ${accessToken}`,
    //         },
    //         body: JSON.stringify({
    //             id,
    //         }),
    //     })
    //         .then(async (res) => {
    //             if (res.status !== 200) {
    //                 return false;
    //             }
    //
    //             await refreshTasks();
    //             return true;
    //         })
    //         .catch(() => false);
    // };

    const deleteUser = (id) => {
        return fetch('http://localhost:8080/api/user', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                id,
            }),
        })
            .then(async (res) => {
                if (res.status !== 200) {
                    return false;
                }

                await refreshUsers();
                return true;
            })
            .catch(() => false);
    };

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        refreshUsers();
    }, [ accessToken ]);

    return (
        <Panel id={id}>
            <PanelHeader
                before={
                    <PanelHeaderBack
                        onClick={() => openView('home')}
                    />
                }
                after={
                    <PanelHeaderButton onClick={() => openPanel('user-create')}>
                        <Icon28AddOutline />
                    </PanelHeaderButton>
                }
            >
                Пользователи
            </PanelHeader>
            {loaded ? (
                <Group>
                    {users.map((x) => {
                        return (
                            <User
                                key={x.id}
                                {...x}
                                onDelete={() => deleteUser(x.id)}
                            />
                        );
                    })}
                </Group>
            ) : (
                <PanelSpinner />
            )}
        </Panel>
    );
};

export default Users;
