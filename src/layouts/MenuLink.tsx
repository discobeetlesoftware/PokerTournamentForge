import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { SxProps, Theme } from "@mui/material/styles"
import { Dispatch, ReactNode, useMemo, forwardRef } from "react"
import { NavLinkProps, useNavigate, NavLink } from "react-router-dom"

type MenuLinkProps = React.PropsWithChildren<{
    route: string,
    title: string,
    icon: ReactNode
    iconSx?: SxProps<Theme>
    setPanelOpen: Dispatch<boolean>
}>

export const MenuLink = (props: MenuLinkProps) => {
    const navigate = useNavigate();
    const MyNavLink = useMemo(() => forwardRef<HTMLAnchorElement, Omit<NavLinkProps, 'to'>>((navLinkProps, ref) => {
        const { className: previousClasses, ...rest } = navLinkProps;
        const elementClasses = previousClasses?.toString() ?? "";
        return (<NavLink {...rest} ref={ref} to={props.route} end className={({ isActive }) => (isActive ? elementClasses + " Mui-selected" : elementClasses)} />)
    }), [props.route]);

    return (
        <ListItemButton
            component={MyNavLink}
            onClick={(e) => {
                props.setPanelOpen(false);
                navigate(props.route);
            }}
        >
            <ListItemIcon sx={{ ...props.iconSx, '.Mui-selected > &': { color: (theme) => theme.palette.primary.main } }}>
                {props.icon}
            </ListItemIcon>
            <ListItemText primary={props.title} />
        </ListItemButton>
    )
}
