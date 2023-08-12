import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { ReactNode } from "react";

export const ChipSetTableView = (props: { headers?: string[], children: ReactNode }) => {
    const headers = props.headers || [];
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width='20%'>Denomination</TableCell>
                            <TableCell width='20%'>Quantity</TableCell>
                            <TableCell width='40%'>Color</TableCell>
                            {
                                headers.map(title => <TableCell>{title}</TableCell>)
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.children}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
