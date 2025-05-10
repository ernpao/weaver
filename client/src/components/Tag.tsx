import { Chip, IconButton, Stack, useTheme } from "@mui/material";
import { Close } from '@mui/icons-material';

interface TagProps {
    text: string;
    onRemove?: (text: string) => void;
}

interface TagContainerProps {
    tags: string[];
    onRemove?: (text: string) => void;
}

export function TagContainer({ tags, onRemove }: TagContainerProps) {
    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
            margin={2}
        >
            {tags.map((tag, index) => (
                <Tag key={index} text={tag} onRemove={onRemove} />
            ))}
        </Stack>
    );
}

export default function Tag({ text, onRemove }: TagProps) {
    const theme = useTheme();

    return (
        <Chip
            label={text}
            color="primary"
            onDelete={onRemove ? () => onRemove(text) : undefined}
            deleteIcon={
                onRemove ? (
                    <Close
                        fontSize="small"
                        sx={{
                            color: theme.palette.primary.contrastText,
                            '&:hover': { color: theme.palette.primary.light },
                        }}
                    />
                ) : undefined
            }
            sx={{
                px: 2,
                py: 1,
                '& .MuiChip-deleteIcon': {
                    opacity: 0,
                    transition: 'opacity 0.2s',
                },
                '&:hover .MuiChip-deleteIcon': {
                    opacity: 1,
                },
            }}
        />
    );
}
