import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { ringSizes } from '@/jotai/data/ringSize';

export default function RingSizesTable() {
  return (
    <Box>
      <iframe
        width="100%"
        src="https://www.youtube.com/embed/9fIfK2B2o2g?si=JzNZUK-uWJFT-U0H"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sizes</TableCell>
            <TableCell>Inches</TableCell>
            <TableCell>MM</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ringSizes.map((ringSize) => {
            return (
              <TableRow key={ringSize.indianSize}>
                <TableCell>{ringSize.indianSize}</TableCell>
                <TableCell>{ringSize.inches}</TableCell>
                <TableCell>{ringSize.circumferenceInMM}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
