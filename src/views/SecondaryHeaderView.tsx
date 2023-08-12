import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";
import { ReactNode } from "react";

export interface BlockHeaderViewProps {
    title: string;
    sx?: SxProps<Theme>;
    children?: ReactNode;
};

export const SecondaryBlockHeaderView = (props: BlockHeaderViewProps) => {
    const { title, children } = props;
    return (
        <Box component='div' sx={{
            ...props.sx,
            pl:1.5,
            mb: 1,
            backgroundColor:'secondary.main',
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'//stolen from app header- easier way?
        }}>
            <Typography variant='h6' component='span' gutterBottom sx={{color:'white'}}>{title}</Typography>
            {children}
        </Box>
    );
};


export const PrimaryBlockHeaderView = (props: BlockHeaderViewProps) => {
    const { title, children } = props;
    return (
        <Box component='div' sx={{
            ...props.sx,
            pl:1.5,
            mb: 1,
            backgroundColor:'primary.main',
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'//stolen from app header- easier way?
        }}>
            <Typography variant='h6' component='span' gutterBottom sx={{color:'white'}}>{title}</Typography>
            {children}
        </Box>
    );
};
