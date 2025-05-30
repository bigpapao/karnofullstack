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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import CancelButton from '../../components/CancelButton';

const Products = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Mock data for products
  const products = [
    { id: 1, name: 'فیلتر روغن تویوتا', category: 'موتور', brand: 'تویوتا', price: '۱۰۰,۰۰۰', stock: 45, status: 'موجود' },
    { id: 2, name: 'لنت ترمز بوش', category: 'ترمز', brand: 'بوش', price: '۲۰۰,۰۰۰', stock: 32, status: 'موجود' },
    { id: 3, name: 'روغن موتور شل', category: 'موتور', brand: 'شل', price: '۱۵۰,۰۰۰', stock: 0, status: 'ناموجود' },
    { id: 4, name: 'باتری واریان', category: 'برق خودرو', brand: 'واریان', price: '۴۰۰,۰۰۰', stock: 12, status: 'موجود' },
    { id: 5, name: 'شمع NGK', category: 'موتور', brand: 'NGK', price: '۸۰,۰۰۰', stock: 60, status: 'موجود' },
    { id: 6, name: 'فیلتر هوا هیوندای', category: 'موتور', brand: 'هیوندای', price: '۹۰,۰۰۰', stock: 25, status: 'موجود' },
    { id: 7, name: 'روغن ترمز موبیل', category: 'ترمز', brand: 'موبیل', price: '۱۲۰,۰۰۰', stock: 0, status: 'ناموجود' },
    { id: 8, name: 'دیسک ترمز فرانو', category: 'ترمز', brand: 'فرانو', price: '۳۵۰,۰۰۰', stock: 8, status: 'موجود' },
    { id: 9, name: 'کمک فنر کیا', category: 'سیستم تعلیق', brand: 'کیا', price: '۴۸۰,۰۰۰', stock: 15, status: 'موجود' },
    { id: 10, name: 'تسمه تایم گیتس', category: 'موتور', brand: 'گیتس', price: '۱۸۰,۰۰۰', stock: 22, status: 'موجود' },
    { id: 11, name: 'واتر پمپ ایساکو', category: 'موتور', brand: 'ایساکو', price: '۲۲۰,۰۰۰', stock: 18, status: 'موجود' },
    { id: 12, name: 'سنسور اکسیژن بوش', category: 'برق خودرو', brand: 'بوش', price: '۳۲۰,۰۰۰', stock: 7, status: 'موجود' },
  ];

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = () => {
    // Here you would typically save the product to your backend
    // For now, we'll just close the dialog
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleConfirmDelete = () => {
    // Here you would typically delete the product from your backend
    // For now, we'll just close the dialog
    setDeleteConfirmOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ direction: 'rtl' }}>
          مدیریت محصولات
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          افزودن محصول
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="جستجو بر اساس نام، برند یا دسته‌بندی..."
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
                <TableCell align="right">نام محصول</TableCell>
                <TableCell align="right">دسته‌بندی</TableCell>
                <TableCell align="right">برند</TableCell>
                <TableCell align="right">قیمت (تومان)</TableCell>
                <TableCell align="right">موجودی</TableCell>
                <TableCell align="right">وضعیت</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell align="right">{product.id}</TableCell>
                    <TableCell align="right">{product.name}</TableCell>
                    <TableCell align="right">{product.category}</TableCell>
                    <TableCell align="right">{product.brand}</TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                    <TableCell align="right">{product.stock}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={product.status}
                        color={product.status === 'موجود' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditProduct(product)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteProduct(product)}
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
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="تعداد در هر صفحه:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
        />
      </Paper>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ direction: 'rtl' }}>
          {selectedProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1, direction: 'rtl' }}>
            <TextField
              label="نام محصول"
              fullWidth
              defaultValue={selectedProduct?.name || ''}
              InputProps={{ sx: { direction: 'rtl' } }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="category-label">دسته‌بندی</InputLabel>
                <Select
                  labelId="category-label"
                  defaultValue={selectedProduct?.category || ''}
                  label="دسته‌بندی"
                >
                  <MenuItem value="موتور">موتور</MenuItem>
                  <MenuItem value="ترمز">ترمز</MenuItem>
                  <MenuItem value="سیستم تعلیق">سیستم تعلیق</MenuItem>
                  <MenuItem value="برق خودرو">برق خودرو</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="brand-label">برند</InputLabel>
                <Select
                  labelId="brand-label"
                  defaultValue={selectedProduct?.brand || ''}
                  label="برند"
                >
                  <MenuItem value="تویوتا">تویوتا</MenuItem>
                  <MenuItem value="بوش">بوش</MenuItem>
                  <MenuItem value="شل">شل</MenuItem>
                  <MenuItem value="واریان">واریان</MenuItem>
                  <MenuItem value="NGK">NGK</MenuItem>
                  <MenuItem value="هیوندای">هیوندای</MenuItem>
                  <MenuItem value="کیا">کیا</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="قیمت (تومان)"
                fullWidth
                defaultValue={selectedProduct?.price || ''}
                InputProps={{ sx: { direction: 'rtl' } }}
              />
              
              <TextField
                label="موجودی"
                fullWidth
                type="number"
                defaultValue={selectedProduct?.stock || ''}
                InputProps={{ sx: { direction: 'rtl' } }}
              />
            </Box>
            
            <FormControl fullWidth>
              <InputLabel id="status-label">وضعیت</InputLabel>
              <Select
                labelId="status-label"
                defaultValue={selectedProduct?.status || 'موجود'}
                label="وضعیت"
              >
                <MenuItem value="موجود">موجود</MenuItem>
                <MenuItem value="ناموجود">ناموجود</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="توضیحات محصول"
              fullWidth
              multiline
              rows={4}
              InputProps={{ sx: { direction: 'rtl' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <CancelButton 
            onClick={handleCloseDialog} 
            color="secondary"
          />
          <Button onClick={handleSaveProduct} variant="contained" color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle sx={{ direction: 'rtl' }}>تایید حذف</DialogTitle>
        <DialogContent>
          <Typography sx={{ direction: 'rtl' }}>
            آیا از حذف محصول "{selectedProduct?.name}" اطمینان دارید؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <CancelButton 
            onClick={handleCloseDeleteConfirm}
            color="secondary"
          />
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
