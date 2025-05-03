import { Chip, IconButton, Stack, useTheme } from "@mui/joy";
import { Close } from '@mui/icons-material';


interface TagProps {
    text: string,
    onRemove?: (text: string) => void;

}

interface TagContainerProps {
    tags: string[],
    onRemove?: (text: string) => void;

}

export function TagContainer({ tags, onRemove }: TagContainerProps) {

    return (
        <Stack direction="row" justifyContent={"center"} alignItems={"center"} gap={1} flexWrap="wrap">
            {tags.map((tag, index) => (
                <Tag key={index} text={tag} onRemove={onRemove} />
            ))}
        </Stack>
    )

}


export default function Tag({ text, onRemove }: TagProps) {
    const theme = useTheme()

    return (<Chip
        color='primary'
        variant="solid"

        onClick={
            () => { if (onRemove) { onRemove(text) } }
        }

        sx={{
            px: 2,
            py: 1,
            ...(onRemove && {
                '&:hover .MuiIconButton-root': { opacity: 1, },
                paddingLeft: 5,
            }),
        }}

        endDecorator={
            onRemove && (<IconButton
                size="sm"
                sx={{
                    ml: 0.5,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 1 },
                }}
            >
                <Close fontSize="small" sx={{ color: theme.vars.palette.primary.solidColor }} />
            </IconButton>)
        }
    >
        {text}
    </Chip>)
}