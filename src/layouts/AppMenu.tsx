import { Dispatch } from "react"
import { configuration } from "../configuration";
import { DataStore, RouteAction } from "../pipes/DataStore";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { ReactComponent as PokerChipIcon } from '../assets/pokerChip.svg';
import { ReactComponent as LevelsIcon } from '../assets/levels.svg';
import beetleLogo from '../assets/beetle.png';
import { MenuLink } from "./MenuLink";
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";

type AppMenuProps = {
    setPanelOpen: Dispatch<boolean>;
}

export const AppMenu = (props: AppMenuProps) => {
    return (
        <>
            <Toolbar className='discobeetle-logo'>
                <a href='http://discobeetle.com' target='_blank' rel='noreferrer'><img src={beetleLogo} alt='Discobeetle logo' /></a>
            </Toolbar>
            <List>
                {links.map(segment => (
                    <MenuLink key={segment.title} {...segment} setPanelOpen={props.setPanelOpen} />
                ))}
            </List>
        </>
    );
}

let strings = configuration.strings.en.nav;

export let links = [
    {
        title: strings.home,
        route: '/',
        icon: <HomeIcon />
    },
    {
        title: strings.chip_sets,
        route: DataStore.route('chipsets', RouteAction.list),
        icon: <PokerChipIcon />,
        iconSx: { fill: 'currentColor', width: '22px', height: '22px', marginLeft: '2px', marginRight: '-2px' }
    },
    {
        title: strings.tournaments,
        route: DataStore.route('tournaments', RouteAction.list),
        icon: <LevelsIcon />,
        iconSx: { fill: 'currentColor', width: '22px', height: '22px', marginLeft: '3px', marginRight: '-3px' }
    },
    {
        title: strings.settings,
        route: 'settings',
        icon: <SettingsIcon />
    },
    {
        title: strings.about,
        route: 'about',
        icon: <InfoIcon />
    }
];
