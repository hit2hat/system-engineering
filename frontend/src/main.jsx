import '@vkontakte/vkui/dist/cssm/styles/themes.css';

import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from '@vkontakte/vkui';

import { store } from './store';
import { Provider as StoreProvider } from 'react-redux';

createRoot(document.getElementById('root')).render(
    <StoreProvider store={store}>
        <ConfigProvider>
            <App />
        </ConfigProvider>
    </StoreProvider>
);
