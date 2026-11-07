import User from '../component/User';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Icon28AddOutline } from '@vkontakte/icons';
import { Panel, PanelHeader, PanelHeaderBack, PanelHeaderButton, PanelSpinner, Group } from '@vkontakte/vkui';

const Users = ({ id, openPanel, openView, selectUser }) => {
    const [ loaded, setLoaded ] = useState(false);
    const [ users, setUsers ] = useState([]);
    const accessToken = useSelector((store) => store.auth.accessToken);

    const refreshUsers = () => {
        return fetch('/api/user', {
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

    const deleteUser = (id) => {
        return fetch('/api/user', {
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
                                onEdit={() => {
                                    selectUser(x);
                                    openPanel('user-change-password');
                                }}
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
