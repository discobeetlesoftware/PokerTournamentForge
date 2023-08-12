import Typography from "@mui/material/Typography";

export const DateView = (props: { created_at?: Date, updated_at?: Date }) => {
    const { created_at, updated_at } = props;
    if (!created_at) {
        return (<></>);
    }
    const formatter = Intl.DateTimeFormat('en', { dateStyle: 'full' });
    const hasUpdates = created_at.getTime() !== updated_at?.getTime();
    const token = hasUpdates ? 'Updated on' : 'Created on';
    return (
        <Typography fontWeight='light' variant='caption'>
            {token} {formatter.format(hasUpdates ? created_at : updated_at)}
        </Typography>
    );
};
