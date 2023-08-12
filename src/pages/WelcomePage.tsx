import Typography from "@mui/material/Typography";
import { ReactComponent as PokerGameIcon } from '../assets/pokerGame.svg';
import { configuration } from "../configuration";
import LocalizationController from "../controllers/LocalizationController";
import HeaderView from "../views/HeaderView";
import { usePageTitle } from "../hooks/usePageTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import SvgIcon from "@mui/material/SvgIcon";
import Button from "@mui/material/Button";

export const WelcomePage = () => {
    let strings = configuration.strings.en.welcome;
    usePageTitle('Welcome');
    const isXS = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'));

    return (
        <Paper className='page welcome'>
            <HeaderView title={strings.title} />
            <div className='content'>
                <SvgIcon component={PokerGameIcon} inheritViewBox color='primary' sx={{ height: '7em', width: '7em', float: (!isXS ? 'left' : ''), marginTop:'-18px', mr: 3 }} />
                <Typography paragraph sx={{mt: 1}}>
                    {LocalizationController.mapString(strings.overview)}
                </Typography>
                <Typography paragraph>
                    {strings.detail}
                </Typography>
                <Typography paragraph>
                    {strings.contact}
                    <Button variant='outlined' href='mailto:discobeetle.software@gmail.com' sx={{ml:1}}>{strings.lmk}</Button>
                </Typography>
            </div>
        </Paper>
    );
};
