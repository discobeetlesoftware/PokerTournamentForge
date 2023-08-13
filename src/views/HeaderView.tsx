import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

interface HeaderProps {
    children?: ReactNode;
    title: string;
}

const HeaderView = (props: HeaderProps) => {
    const { children, title } = props;
    return (
        <header>
            <Typography variant='h4' gutterBottom>
                {title}
                {children}
            </Typography>
        </header>
    );
};

export default HeaderView;
