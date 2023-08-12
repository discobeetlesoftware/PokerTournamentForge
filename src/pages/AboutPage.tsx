import Typography from "@mui/material/Typography";
import { configuration } from "../configuration";
import HeaderView from "../views/HeaderView";
import Paper from "@mui/material/Paper";
import { usePageTitle } from "../hooks/usePageTitle";

export const AboutPage = () => {
    let strings = configuration.strings.en.about;
    usePageTitle(strings.title);
    return (
        <Paper className='page about'>
            <HeaderView title={strings.title} />
            <div className='content'>
                <Typography paragraph>
                    <span dangerouslySetInnerHTML={{ __html: strings.overview }}></span>
                </Typography>
                <div className='left content'>
                    <Typography variant='h6'>
                        {strings.attributions.title}
                    </Typography>
                    <ul>
                        <Typography component='p' variant='body2'>
                            {strings.attributions.elements.map((element, index) => {
                                return <li key={index} dangerouslySetInnerHTML={{ __html: element }}></li>
                            })}
                        </Typography>
                    </ul>
                </div>
            </div>
        </Paper>
    );
};
