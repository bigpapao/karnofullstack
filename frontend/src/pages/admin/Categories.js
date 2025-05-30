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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

const Categories = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Mock data for categories
  const categories = [
    { id: 1, name: 'موتور', description: 'قطعات مرتبط با موتور خودرو', productsCount: 45, image: 'motor.jpg' },
    { id: 2, name: 'ترمز', description: 'سیستم ترمز و قطعات مرتبط', productsCount: 28, image: 'brake.jpg' },
    { id: 3, name: 'سیستم تعلیق', description: 'کمک فنر، فنر و دیگر قطعات سیستم تعلیق', productsCount: 15, image: 'suspension.jpg' },
    { id: 4, name: 'برق خودرو', description: 'باتری، دینام و سایر قطعات الکتریکی', productsCount: 32, image: 'electric.jpg' },
    { id: 5, name: 'بدنه', description: 'قطعات بدنه و تزئینات خارجی', productsCount: 20, image: 'body.jpg' },
    { id: 6, name: 'فیلترها', description: 'انواع فیلترهای روغن، هوا و سوخت', productsCount: 18, image: 'filters.jpg' },
    { id: 7, name: 'روغن و روانکارها', description: 'انواع روغن موتور، گیربکس و روانکارها', productsCount: 12, image: 'oils.jpg' },
    { id: 8, name: 'سیستم سوخت رسانی', description: 'پمپ بنزین، انژکتور و قطعات مرتبط', productsCount: 22, image: 'fuel.jpg' },
    { id: 9, name: 'سیستم خنک کننده', description: 'رادیاتور، واتر پمپ و قطعات مرتبط', productsCount: 14, image: 'cooling.jpg' },
    { id: 10, name: 'سیستم انتقال قدرت', description: 'گیربکس، کلاچ و قطعات مرتبط', productsCount: 25, image: 'transmission.jpg' },
    { id: 11, name: 'چراغ‌ها', description: 'انواع چراغ‌های جلو، عقب و راهنما', productsCount: 30, image: 'lights.jpg' },
    { id: 12, name: 'لوازم جانبی', description: 'لوازم جانبی و تزئینات داخلی', productsCount: 40, image: 'accessories.jpg' },
  ];

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setOpenDialog(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = () => {
    // Here you would typically save the category to your backend
    // For now, we'll just close the dialog
    setOpenDialog(false);
    setSelectedCategory(null);
  };

  const handleConfirmDelete = () => {
    // Here you would typically delete the category from your backend
    // For now, we'll just close the dialog
    setDeleteConfirmOpen(false);
    setSelectedCategory(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ direction: 'rtl' }}>
          مدیریت دسته‌بندی‌ها
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
        >
          افزودن دسته‌بندی
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="جستجو بر اساس نام یا توضیحات..."
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
                <TableCell align="right">نام دسته‌بندی</TableCell>
                <TableCell align="right">توضیحات</TableCell>
                <TableCell align="right">تعداد محصولات</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell align="right">{category.id}</TableCell>
                    <TableCell align="right">{category.name}</TableCell>
                    <TableCell align="right">{category.description}</TableCell>
                    <TableCell align="right">{category.productsCount}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditCategory(category)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCategory(category)}
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
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="تعداد در هر صفحه:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
        />
      </Paper>

      {/* Add/Edit Category Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ direction: 'rtl' }}>
          {selectedCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1, direction: 'rtl' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="نام دسته‌بندی"
                  fullWidth
                  defaultValue={selectedCategory?.name || ''}
                  InputProps={{ sx: { direction: 'rtl' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="توضیحات"
                  fullWidth
                  multiline
                  rows={3}
                  defaultValue={selectedCategory?.description || ''}
                  InputProps={{ sx: { direction: 'rtl' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  تصویر دسته‌بندی
                </Typography>
                <Box 
                  sx={{ 
                    border: '1px dashed #ccc', 
                    borderRadius: 1, 
                    p: 3, 
                    textAlign: 'center',
                    bgcolor: '#f9f9f9'
                  }}
                >
                  <CategoryIcon sx={{ fontSize: 48, color: '#aaa', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    تصویر را اینجا رها کنید یا
                  </Typography>
                  <Button variant="outlined" size="small">
                    انتخاب فایل
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button onClick={handleSaveCategory} variant="contained" color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle sx={{ direction: 'rtl' }}>تایید حذف</DialogTitle>
        <DialogContent>
          <Typography sx={{ direction: 'rtl' }}>
            آیا از حذف دسته‌بندی "{selectedCategory?.name}" اطمینان دارید؟
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2, direction: 'rtl' }}>
            توجه: با حذف این دسته‌بندی، {selectedCategory?.productsCount} محصول بدون دسته‌بندی خواهند شد.
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

export default Categories;
