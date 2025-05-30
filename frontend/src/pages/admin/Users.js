import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Mock data for users
  const users = [
    { id: 1, name: 'علی محمدی', email: 'ali@example.com', role: 'کاربر', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۸', orders: 5 },
    { id: 2, name: 'سارا احمدی', email: 'sara@example.com', role: 'کاربر', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۷', orders: 3 },
    { id: 3, name: 'محمد رضایی', email: 'mohammad@example.com', role: 'کاربر', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۶', orders: 2 },
    { id: 4, name: 'زهرا کریمی', email: 'zahra@example.com', role: 'کاربر', status: 'غیرفعال', lastLogin: '۱۴۰۴/۰۴/۲۵', orders: 1 },
    { id: 5, name: 'امیر حسینی', email: 'amir@example.com', role: 'کاربر', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۵', orders: 4 },
    { id: 6, name: 'رضا محمودی', email: 'reza@example.com', role: 'مدیر', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۸', orders: 0 },
    { id: 7, name: 'مریم صادقی', email: 'maryam@example.com', role: 'کاربر', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۴', orders: 2 },
    { id: 8, name: 'حسین علوی', email: 'hossein@example.com', role: 'کاربر', status: 'غیرفعال', lastLogin: '۱۴۰۴/۰۴/۱۵', orders: 0 },
    { id: 9, name: 'فاطمه نوری', email: 'fateme@example.com', role: 'کاربر', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۳', orders: 1 },
    { id: 10, name: 'جواد کاظمی', email: 'javad@example.com', role: 'کاربر', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۲', orders: 3 },
    { id: 11, name: 'نرگس حیدری', email: 'narges@example.com', role: 'پشتیبان', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۸', orders: 0 },
    { id: 12, name: 'سعید رضایی', email: 'saeed@example.com', role: 'کاربر', status: 'فعال', lastLogin: '۱۴۰۴/۰۵/۰۱', orders: 2 },
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    // Here you would typically save the user to your backend
    // For now, we'll just close the dialog
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    // Here you would typically delete the user from your backend
    // For now, we'll just close the dialog
    setDeleteConfirmOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ direction: 'rtl' }}>
          مدیریت کاربران
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          افزودن کاربر
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="جستجو بر اساس نام، ایمیل یا نقش..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { direction: 'rtl' }
            }}
          />
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="right">شناسه</TableCell>
                <TableCell align="right">نام</TableCell>
                <TableCell align="right">ایمیل</TableCell>
                <TableCell align="right">نقش</TableCell>
                <TableCell align="right">وضعیت</TableCell>
                <TableCell align="right">آخرین ورود</TableCell>
                <TableCell align="right">تعداد سفارشات</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell align="right">{user.id}</TableCell>
                    <TableCell align="right">{user.name}</TableCell>
                    <TableCell align="right">{user.email}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={user.role}
                        color={user.role === 'مدیر' ? 'primary' : user.role === 'پشتیبان' ? 'secondary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={user.status}
                        color={user.status === 'فعال' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{user.lastLogin}</TableCell>
                    <TableCell align="right">{user.orders}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditUser(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(user)}
                        disabled={user.role === 'مدیر'} // Prevent deleting admin users
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="تعداد در هر صفحه:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
        />
      </Paper>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ direction: 'rtl' }}>
          {selectedUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1, direction: 'rtl' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="نام و نام خانوادگی"
                  fullWidth
                  defaultValue={selectedUser?.name || ''}
                  InputProps={{ sx: { direction: 'rtl' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ایمیل"
                  fullWidth
                  type="email"
                  defaultValue={selectedUser?.email || ''}
                  InputProps={{ sx: { direction: 'rtl' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="رمز عبور"
                  fullWidth
                  type="password"
                  InputProps={{ sx: { direction: 'rtl' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="تکرار رمز عبور"
                  fullWidth
                  type="password"
                  InputProps={{ sx: { direction: 'rtl' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">نقش</InputLabel>
                  <Select
                    labelId="role-label"
                    defaultValue={selectedUser?.role || 'کاربر'}
                    label="نقش"
                  >
                    <MenuItem value="کاربر">کاربر</MenuItem>
                    <MenuItem value="پشتیبان">پشتیبان</MenuItem>
                    <MenuItem value="مدیر">مدیر</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={selectedUser ? selectedUser.status === 'فعال' : true}
                      color="success"
                    />
                  }
                  label="کاربر فعال است"
                  sx={{ mr: 0 }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">اطلاعات تماس</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="شماره تلفن"
                    fullWidth
                    InputProps={{ sx: { direction: 'rtl' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="آدرس"
                    fullWidth
                    InputProps={{ sx: { direction: 'rtl' } }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle sx={{ direction: 'rtl' }}>تایید حذف</DialogTitle>
        <DialogContent>
          <Typography sx={{ direction: 'rtl' }}>
            آیا از حذف کاربر "{selectedUser?.name}" اطمینان دارید؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>انصراف</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
