import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Panel, PanelHeader, PanelHeaderBack, FormItem, Input, Button } from '@vkontakte/vkui';

const TaskCreate = ({ id, openPanel }) => {
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const accessToken = useSelector((store) => store.auth.accessToken);

    const createTask = async () => {
        const body = await fetch('/api/task', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
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
                    <PanelHeaderBack onClick={() => openPanel('tasks')} />
                }
            >
                Создать задачу
            </PanelHeader>
            <FormItem htmlFor="title" top="Название">
                <Input
                    id="title"
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
            </FormItem>
            <FormItem htmlFor="description" top="Описание">
                <Input
                    id="description"
                    type="text"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                />
            </FormItem>
            <FormItem>
                <Button
                    size="l"
                    stretched
                    disabled={title.length < 3 || description.length > 255}
                    onClick={async () => {
                        const result = await createTask().catch(() => null);
                        if (!result) {
                            return alert('Не удалось создать задачу');
                        }

                        return openPanel('tasks');
                    }}
                >
                    Создать
                </Button>
            </FormItem>
        </Panel>
    );
};

export default TaskCreate;
