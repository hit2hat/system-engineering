import Task from '../component/Task';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Icon28SettingsOutline, Icon28AddOutline } from '@vkontakte/icons';
import { Panel, PanelHeader, PanelHeaderButton, PanelSpinner, Group } from '@vkontakte/vkui';

const Tasks = ({ id, openPanel }) => {
    const [ loaded, setLoaded ] = useState(false);
    const [ tasks, setTasks ] = useState([]);

    const role = useSelector((store) => store.auth.role);
    const accessToken = useSelector((store) => store.auth.accessToken);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        fetch('http://localhost:8080/api/task', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((tasks) => {
                setTasks(tasks);
                setLoaded(true);
            })
            .catch(() => null);
    }, [ accessToken ]);

    return (
        <Panel id={id}>
            <PanelHeader
                before={
                    <PanelHeaderButton>
                        <Icon28SettingsOutline />
                    </PanelHeaderButton>
                }
                after={
                    <PanelHeaderButton onClick={() => openPanel('task-create')}>
                        <Icon28AddOutline />
                    </PanelHeaderButton>
                }
            >
                Задачи
            </PanelHeader>
            {loaded ? (
                <Group>
                    {tasks.map((x) => {
                        return (
                            <Task
                                key={x.id}
                                {...x}
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

export default Tasks;
