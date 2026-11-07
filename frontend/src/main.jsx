import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/cssm/styles/themes.css';

createRoot(document.getElementById('root')).render(
    <ConfigProvider>
        <App />
    </ConfigProvider>
);
