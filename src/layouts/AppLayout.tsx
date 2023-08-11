import { Outlet, ScrollRestoration } from "react-router-dom"
import { useState } from "react";

import { configuration } from "../configuration";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AppMenu } from "./AppMenu";
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = configuration.global.drawerWidth;

export const AppLayout = () => {
    const [panelOpen, setPanelOpen] = useState(false);

    const handleDrawerToggle = () => {
        setPanelOpen(!panelOpen);
    };

    return (
        <div className='app-layout'>
            <ScrollRestoration />
            <main>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        sx={{
                            width: { lg: `calc(100% - ${drawerWidth}px)` },
                            ml: { lg: `${drawerWidth}px` },
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { lg: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                {configuration.strings.en.app.name}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Box
                        component="nav"
                        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
                    >
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <Drawer
                            // container={container}
                            variant="temporary"
                            open={panelOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{ keepMounted: true }}
                            sx={{
                                display: { xs: 'block', lg: 'none' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                            }}
                        >
                            <AppMenu setPanelOpen={setPanelOpen} />
                        </Drawer>
                        <Drawer
                            variant="permanent"
                            sx={{
                                display: { xs: 'none', lg: 'block' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                            }}
                            open
                        >
                            <AppMenu setPanelOpen={setPanelOpen} />
                        </Drawer>
                    </Box>
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, p: 2, width: { lg: `calc(100% - ${drawerWidth}px)` } }}
                    >
                        <Toolbar />
                        <Outlet />
                    </Box>
                </Box>
            </main>
        </div>
    );
};
