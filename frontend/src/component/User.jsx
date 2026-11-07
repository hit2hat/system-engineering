import { Box, ContentCard, Button, ButtonGroup } from '@vkontakte/vkui';

const getRoleText = (role) => {
    switch (role) {
        case 'ADMIN': {
            return 'Администратор';
        }

        case 'CLIENT': {
            return 'Пользователь';
        }

        default: {
            return role;
        }
    }
};

const User = ({ id, username, role, onEdit, onDelete }) => {
    return (
        <Box margin="m">
            <ContentCard
                mode="outline"
                overTitle={`${id} • ${getRoleText(role)}`}
                title={username}
                caption={
                    <ButtonGroup
                        gap="s"
                        stretched
                        mode="horizontal"
                        style={{
                            marginTop: 12,
                        }}
                    >
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

export default User;
