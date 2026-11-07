import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/auth.slice';
import { View, Panel, PanelHeader, FormItem, Input, Button } from '@vkontakte/vkui';

const Login = ({ id, openView }) => {
    const dispatch = useDispatch();
    const [ username, setUsername ] = useState('ops');
    const [ password, setPassword ] = useState('1234567890');

    const login = async () => {
        const body = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        try {
            const result = await body.json();
            if (body.status !== 200 || !result.accessToken) {
                return false;
            }

            dispatch(
                authActions.login({
                    role: result.role,
                    accessToken: result.accessToken,
                })
            );

            return true;
        } catch (e) {
            return false;
        }
    };

    return (
        <View id={id} activePanel={id}>
            <Panel id={id}>
                <PanelHeader>Вход</PanelHeader>
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
                        disabled={username.length === 0 || password.length === 0}
                        onClick={async () => {
                            const result = await login().catch(() => null);
                            if (!result) {
                                return alert('Неверный логин или пароль');
                            }

                            return openView('home');
                        }}
                    >
                        Войти
                    </Button>
                </FormItem>
            </Panel>
        </View>
    );
};

export default Login;
