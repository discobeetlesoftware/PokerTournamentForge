import { TournamentLevelPayload, TournamentPayload } from "../../pipes/DataStoreSchemaV1";
import Time from "../../models/Time";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { FormatterController } from "../../controllers/FormatterController";

export const TournamentLevelsView = (props: { tournament: TournamentPayload }) => {
    const { tournament } = props;

    const hasGames = tournament.games.length > 0;

    function levelText(level: TournamentLevelPayload, index: number): string {
        if (level.type === 'round') {
            return `Level ${index - level.breakOffset + 1}`;
        } else {
            return `Break ${level.breakOffset}`;
        }
    }

    var time = new Time(0, tournament.start_time);
    function levelStartTime(level: TournamentLevelPayload): string {
        const result = time.toString();
        time.append(level.duration || 0);
        return result;
    }

    function levelBlind(level: TournamentLevelPayload, index: number): string {
        if (level.type === 'break' || !level.denominations) {
            return '';
        }
        const value = level.denominations[index];
        return value.toString();
    }

    function levelClassName(level: TournamentLevelPayload, index: number): string {
        if (level.is_expected_conclusion) {
            return 'tournament-level-conclusion';
        }
        if (level.type === 'round') {
            return index % 2 === 0 ? 'tournament-level-row' : '';
        }
        return 'tournament-break-row';
    }

    function levelNote(level: TournamentLevelPayload): string {
        if (level.is_expected_conclusion) {
            return 'Expected conclusion';
        }
        return level.note || '';
    }

    return (
        <TableContainer sx={{ overflow: 'clip' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Level</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>Small Blind</TableCell>
                        <TableCell>Big Blind</TableCell>
                        {hasGames && <TableCell>Game</TableCell>}
                        <TableCell>Notes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        tournament.levels.map((level, index) =>
                            <TableRow key={'level' + index} className={levelClassName(level, index)}>
                                <TableCell>{levelText(level, index)}</TableCell>
                                <TableCell>{FormatterController.time(level.duration)}</TableCell>
                                <TableCell>{levelStartTime(level)}</TableCell>
                                {level.type === 'round' && <TableCell>{levelBlind(level, 0)}</TableCell>}
                                {level.type === 'round' && <TableCell>{levelBlind(level, 1)}</TableCell>}
                                {hasGames && 
                                    <TableCell>
                                        {level.type === 'round' &&
                                            <>{level.game}</>
                                        }
                                    </TableCell>}
                                <TableCell style={{ textAlign: 'right' }} colSpan={level.type === 'round' ? 1 : 3}>{levelNote(level)}</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}