import { useState } from 'react';
import Tasks from '../screens/Tasks';
import { View } from '@vkontakte/vkui';
import TaskCreate from '../screens/TaskCreate';

const Home = ({ id, openView }) => {
    const [ activePanel, setActivePanel ] = useState('tasks');

    return (
        <View id={id} activePanel={activePanel}>
            <Tasks
                id="tasks"
                openView={openView}
                openPanel={setActivePanel}
            />
            <TaskCreate
                id="task-create"
                openPanel={setActivePanel}
            />
        </View>
    );
};

export default Home;
