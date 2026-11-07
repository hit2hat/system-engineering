import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Panel, PanelHeader, PanelHeaderBack, FormItem, Input, SegmentedControl, Button } from '@vkontakte/vkui';

const UserCreate = ({ id, openPanel }) => {
    const [ role, setRole ] = useState('CLIENT');
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const accessToken = useSelector((store) => store.auth.accessToken);

    const createUser = async () => {
        const body = await fetch('http://localhost:8080/api/user', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role,
                username,
                password,
            }),
        });

        try {
            return body.status === 200;
        } catch (e) {
            return false;
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader
                before={
                    <PanelHeaderBack onClick={() => openPanel('users')} />
                }
            >
                Создать пользователя
            </PanelHeader>
            <FormItem>
                <SegmentedControl
                    value={role}
                    onChange={(value) => setRole(value)}
                    options={[
                        {
                            label: 'Пользователь',
                            value: 'CLIENT',
                        },
                        {
                            label: 'Администратор',
                            value: 'ADMIN',
                        },
                    ]}
                />
            </FormItem>
            <FormItem htmlFor="username" top="Имя пользователя">
                <Input
                    id="username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.currentTarget.value)}
                />
            </FormItem>
            <FormItem htmlFor="password" top="Пароль">
                <Input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                />
            </FormItem>
            <FormItem>
                <Button
                    size="l"
                    stretched
                    disabled={username.length < 3 || password.length < 8}
                    onClick={async () => {
                        const result = await createUser().catch(() => null);
                        if (!result) {
                            return alert('Не удалось создать пользователя');
                        }

                        return openPanel('users');
                    }}
                >
                    Создать
                </Button>
            </FormItem>
        </Panel>
    );
};

export default UserCreate;
