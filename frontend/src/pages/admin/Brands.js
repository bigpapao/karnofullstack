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
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  BrandingWatermark as BrandIcon,
} from '@mui/icons-material';

const Brands = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Mock data for brands
  const brands = [
    { id: 1, name: 'تویوتا', country: 'ژاپن', featured: true, productsCount: 28, logo: 'toyota.jpg' },
    { id: 2, name: 'بوش', country: 'آلمان', featured: true, productsCount: 35, logo: 'bosch.jpg' },
    { id: 3, name: 'شل', country: 'هلند', featured: true, productsCount: 12, logo: 'shell.jpg' },
    { id: 4, name: 'واریان', country: 'ایران', featured: false, productsCount: 8, logo: 'varian.jpg' },
    { id: 5, name: 'NGK', country: 'ژاپن', featured: true, productsCount: 15, logo: 'ngk.jpg' },
    { id: 6, name: 'هیوندای', country: 'کره جنوبی', featured: false, productsCount: 22, logo: 'hyundai.jpg' },
    { id: 7, name: 'موبیل', country: 'آمریکا', featured: false, productsCount: 10, logo: 'mobil.jpg' },
    { id: 8, name: 'فرانو', country: 'ایران', featured: false, productsCount: 14, logo: 'frano.jpg' },
    { id: 9, name: 'کیا', country: 'کره جنوبی', featured: false, productsCount: 18, logo: 'kia.jpg' },
    { id: 10, name: 'گیتس', country: 'آمریکا', featured: false, productsCount: 9, logo: 'gates.jpg' },
    { id: 11, name: 'ایساکو', country: 'ایران', featured: true, productsCount: 30, logo: 'isaco.jpg' },
    { id: 12, name: 'کاستورل', country: 'انگلستان', featured: false, productsCount: 7, logo: 'castrol.jpg' },
  ];

  // Filter brands based on search term
  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.country.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddBrand = () => {
    setSelectedBrand(null);
    setOpenDialog(true);
  };

  const handleEditBrand = (brand) => {
    setSelectedBrand(brand);
    setOpenDialog(true);
  };

  const handleDeleteBrand = (brand) => {
    setSelectedBrand(brand);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBrand(null);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setSelectedBrand(null);
  };

  const handleSaveBrand = () => {
    // Here you would typically save the brand to your backend
    // For now, we'll just close the dialog
    setOpenDialog(false);
    setSelectedBrand(null);
  };

  const handleConfirmDelete = () => {
    // Here you would typically delete the brand from your backend
    // For now, we'll just close the dialog
    setDeleteConfirmOpen(false);
    setSelectedBrand(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ direction: 'rtl' }}>
          مدیریت برندها
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddBrand}
        >
          افزودن برند
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="جستجو بر اساس نام یا کشور..."
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
                <TableCell align="right">نام برند</TableCell>
                <TableCell align="right">کشور</TableCell>
                <TableCell align="right">ویژه</TableCell>
                <TableCell align="right">تعداد محصولات</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBrands
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell align="right">{brand.id}</TableCell>
                    <TableCell align="right">{brand.name}</TableCell>
                    <TableCell align="right">{brand.country}</TableCell>
                    <TableCell align="right">
                      {brand.featured ? 'بله' : 'خیر'}
                    </TableCell>
                    <TableCell align="right">{brand.productsCount}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditBrand(brand)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteBrand(brand)}
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
          count={filteredBrands.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="تعداد در هر صفحه:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
        />
      </Paper>

      {/* Add/Edit Brand Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ direction: 'rtl' }}>
          {selectedBrand ? 'ویرایش برند' : 'افزودن برند جدید'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1, direction: 'rtl' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="نام برند"
                  fullWidth
                  defaultValue={selectedBrand?.name || ''}
                  InputProps={{ sx: { direction: 'rtl' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="کشور"
                  fullWidth
                  defaultValue={selectedBrand?.country || ''}
                  InputProps={{ sx: { direction: 'rtl' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={selectedBrand ? selectedBrand.featured : false}
                      color="primary"
                    />
                  }
                  label="نمایش در برندهای ویژه"
                  sx={{ mr: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  لوگوی برند
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
                  <BrandIcon sx={{ fontSize: 48, color: '#aaa', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    تصویر را اینجا رها کنید یا
                  </Typography>
                  <Button variant="outlined" size="small">
                    انتخاب فایل
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="توضیحات برند"
                  fullWidth
                  multiline
                  rows={3}
                  InputProps={{ sx: { direction: 'rtl' } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button onClick={handleSaveBrand} variant="contained" color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle sx={{ direction: 'rtl' }}>تایید حذف</DialogTitle>
        <DialogContent>
          <Typography sx={{ direction: 'rtl' }}>
            آیا از حذف برند "{selectedBrand?.name}" اطمینان دارید؟
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2, direction: 'rtl' }}>
            توجه: با حذف این برند، {selectedBrand?.productsCount} محصول بدون برند خواهند شد.
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

export default Brands;
