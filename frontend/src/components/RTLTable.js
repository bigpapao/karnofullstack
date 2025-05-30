import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';

/**
 * RTLTable Component
 * 
 * A wrapper component for Material UI Table that handles RTL-specific
 * behavior like sort direction, text alignment, and pagination.
 */
const RTLTable = ({
  columns,
  data = [],
  sortBy,
  sortDirection,
  onSort,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
  emptyMessage = 'داده‌ای یافت نشد',
  stickyHeader = false,
  dense = false,
  rowsPerPageOptions = [10, 25, 50, 100],
  withPagination = true,
  maxHeight
}) => {
  // Handle sort change
  const handleSort = (id) => {
    const isAsc = sortBy === id && sortDirection === 'asc';
    if (onSort) {
      onSort(id, isAsc ? 'desc' : 'asc');
    }
  };
  
  // Create the table container styles
  const tableContainerStyles = {
    direction: 'rtl',
    ...(maxHeight ? { maxHeight } : {})
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        {loading && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        )}
        <Table stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'right'}
                  padding={column.disablePadding ? 'none' : 'normal'}
                  sortDirection={sortBy === column.id ? sortDirection : false}
                  sx={{ fontWeight: 'bold', ...column.headerStyle }}
                  width={column.width}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                      // Important override for RTL sort icon direction
                      sx={{ 
                        '& .MuiTableSortLabel-icon': {
                          transform: 'scaleX(-1)', // Flip sort icon for RTL
                          marginRight: 0.5, 
                          marginLeft: 0.5,
                        }
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow
                  hover
                  key={row.id || `row-${rowIndex}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${row.id || rowIndex}-${column.id}`}
                      align={column.align || 'right'}
                      padding={column.disablePadding ? 'none' : 'normal'}
                      sx={column.cellStyle}
                    >
                      {column.render ? column.render(row, rowIndex) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" sx={{ py: 3 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {withPagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount || data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          labelRowsPerPage="ردیف در هر صفحه:"
          labelDisplayedRows={({ from, to, count }) => (
            `${from}-${to} از ${count !== -1 ? count : `بیش از ${to}`}`
          )}
          getItemAriaLabel={(type) => {
            switch (type) {
              case 'first':
                return 'رفتن به صفحه اول';
              case 'last':
                return 'رفتن به صفحه آخر';
              case 'next':
                return 'رفتن به صفحه بعد';
              case 'previous':
                return 'رفتن به صفحه قبل';
              default:
                return '';
            }
          }}
          showFirstButton
          showLastButton
          SelectProps={{
            inputProps: { 'aria-label': 'ردیف در هر صفحه' },
          }}
          // Override backIcon and nextIcon for RTL
          sx={{
            '.MuiTablePagination-actions': {
              flexDirection: 'row-reverse',
            }
          }}
        />
      )}
    </Box>
  );
};

RTLTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      sortable: PropTypes.bool,
      disablePadding: PropTypes.bool,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      headerStyle: PropTypes.object,
      cellStyle: PropTypes.object,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  onSort: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  totalCount: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  stickyHeader: PropTypes.bool,
  dense: PropTypes.bool,
  rowsPerPageOptions: PropTypes.array,
  withPagination: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default RTLTable; 