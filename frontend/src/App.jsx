import Home from './pages/Home';
import { useState } from 'react';
import Login from './pages/Login';
import { AppRoot, Root } from '@vkontakte/vkui';

const App = () => {
    const [ activeView, setActiveView ] = useState('login');

    return (
        <AppRoot>
            <Root activeView={activeView}>
                <Login
                    id="login"
                    openView={setActiveView}
                />
                <Home
                    id="home"
                    openView={setActiveView}
                />
            </Root>
        </AppRoot>
    );
};

export default App;
