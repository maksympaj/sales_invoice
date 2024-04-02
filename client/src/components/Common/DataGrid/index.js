import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  tableCellClasses,
  TableSortLabel,
} from '@mui/material';
import { grey, teal } from '@mui/material/colors';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  ArrowDropDown as ArrowDropDownIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    columns,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    nonSelect,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {!nonSelect && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
        )}
        {columns.map(({ id, label, nonSort, sx, ...restProps }) => (
          <TableCell
            key={id}
            align="left"
            sx={{ p: '3px 0 3px 5px', ...sx }}
            sortDirection={orderBy === id ? order : false}
            {...restProps}
          >
            {nonSort ? (
              label
            ) : (
              <TableSortLabel
                active={orderBy === id}
                direction={orderBy === id ? order : 'asc'}
                onClick={createSortHandler(id)}
                IconComponent={ArrowDropDownIcon}
              >
                {label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  columns: PropTypes.arrayOf(Object).isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { title, numSelected, onBulkEditClick, onBulkRemoveClick } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}

      {numSelected > 0 && (
        <>
          {onBulkEditClick && (
            <Tooltip title="Edit">
              <IconButton onClick={onBulkEditClick}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onBulkRemoveClick && (
            <Tooltip title="Delete">
              <IconButton onClick={onBulkRemoveClick}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  title: PropTypes.string,
  numSelected: PropTypes.number,
  onBulkEditClick: PropTypes.func,
  onBulkRemoveClick: PropTypes.func,
};

const useDataGridStyles = makeStyles((theme) => ({
  table: {
    [`& .MuiTableCell-root.${tableCellClasses.head}`]: {
      backgroundColor: teal[400],
      '&, & *': { color: teal[50] },
      fontSize: 16,
      fontWeight: 600,
    },
    [`& .MuiTableCell-root.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
    '& .MuiTableRow-root': {
      height: 40,
      '&:nth-of-type(odd)': {
        backgroundColor: grey[50],
      },
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    },
  },
}));

const DataGrid = (props) => {
  const {
    title,
    columns,
    nonSelect,
    onBulkEditClick,
    onBulkRemoveClick,
    rows,
  } = props;

  const classes = useDataGridStyles();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('index');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsLength, setRowsLength] = useState(rows.length)

  const prevRows = useRef();

  useEffect(() => {
    if (prevRows.current !== rows.map((tmp) => tmp.id).join(',')) {
      prevRows.current = rows.map((tmp) => tmp.id).join(',');
      setSelected(
        selected.filter((item) => rows.map((row) => row.id).includes(item))
      );
    }

    if (rows.length !== rowsLength) {
      setPage(0);
      setRowsLength(rows.length)
    }
  }, [rows, selected]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mt: 2 }}>
        <EnhancedTableToolbar
          title={title}
          numSelected={selected.length}
          onBulkEditClick={
            onBulkEditClick
              ? (event) => {
                event.preventDefault();
                onBulkEditClick(selected);
              }
              : null
          }
          onBulkRemoveClick={
            onBulkRemoveClick
              ? (event) => {
                event.preventDefault();
                onBulkRemoveClick(selected);
              }
              : null
          }
        />
        <TableContainer>
          <Table
            className={classes.table}
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              nonSelect={nonSelect}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      style={row.bkColor === 1 ? { backgroundColor: "#cccccc"} : {}}
                    >
                      {!nonSelect && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            onClick={(event) => handleClick(event, row.id)}
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                      )}

                      {columns.map(
                        (
                          { id, label, nonSort, sx, ...restProps },
                          filedIndex
                        ) => (
                          <TableCell
                            key={filedIndex}
                            component="th"
                            id={filedIndex === 0 ? labelId : ''}
                            scope="row"
                            sx={{ p: '3px 0 3px 5px', ...sx }}
                            {...restProps}
                          >
                            {id === 'index' ? row[id] + 1 : row[id]}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

DataGrid.propTypes = {
  title: PropTypes.string,
  nonSelect: PropTypes.bool,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  onBulkRemoveClick: PropTypes.func,
  onBulkEditClick: PropTypes.func,
};

export default DataGrid;
