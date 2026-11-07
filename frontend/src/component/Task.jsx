import { Box, ContentCard, Button, ButtonGroup } from '@vkontakte/vkui';

const getStatusText = (status) => {
    switch (status) {
        case 'created': {
            return 'Новая задача';
        }

        case 'working': {
            return 'В работе';
        }

        case 'done': {
            return 'Выполнена';
        }

        default: {
            return status;
        }
    }
}

const getActionText = (status) => {
    switch (status) {
        case 'created': {
            return 'Взять в работу';
        }

        case 'working': {
            return 'Завершить';
        }

        case 'done': {
            return null;
        }

        default: {
            return null;
        }
    }
}

const Task = ({ id, title, description, status, onAction, onDelete }) => {
    return (
        <Box margin="m">
            <ContentCard
                mode="outline"
                overTitle={getStatusText(status)}
                title={title}
                description={description}
                caption={
                    <ButtonGroup
                        gap="s"
                        stretched
                        mode="horizontal"
                        style={{
                            marginTop: 12,
                        }}
                    >
                        {
                            getActionText(status) !== null && (
                                <Button
                                    size="s"
                                    stretched
                                    onClick={onAction}
                                >
                                    {getActionText(status)}
                                </Button>
                            )
                        }
                        <Button
                            size="s"
                            stretched
                            appearance="negative"
                            onClick={onDelete}
                        >
                            Удалить
                        </Button>
                    </ButtonGroup>
                }
            />
        </Box>
    );
};

export default Task;
