import { Box, ContentCard } from '@vkontakte/vkui';

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

const Task = ({ id, title, description, status }) => {
    return (
        <Box margin="m">
            <ContentCard
                mode="outline"
                overTitle={getStatusText(status)}
                title={title}
                description={description}
            />
        </Box>
    );
};

export default Task;
