import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Panel, PanelHeader, PanelHeaderBack, FormItem, Input, Button } from '@vkontakte/vkui';

const UserChangePassword = ({ id, selectedUser, openPanel }) => {
    const [ password, setPassword ] = useState('');
    const accessToken = useSelector((store) => store.auth.accessToken);

    const changePassword = async () => {
        const body = await fetch('http://localhost:8080/api/user', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: selectedUser.id,
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
                Изменить пароль
            </PanelHeader>
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
                    disabled={password.length < 8}
                    onClick={async () => {
                        const result = await changePassword().catch(() => null);
                        if (!result) {
                            return alert('Не удалось изменить пароль пользователя');
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

export default UserChangePassword;
