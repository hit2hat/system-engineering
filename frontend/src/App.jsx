import { AppRoot, View, Panel, PanelHeader } from '@vkontakte/vkui';

const App = () => {
    return (
        <AppRoot>
            <View id="123" activePanel="123">
                <Panel id="123">
                    <PanelHeader>123</PanelHeader>
                </Panel>
            </View>
        </AppRoot>
    );
};

export default App;
