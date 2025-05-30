import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  DirectionsCar,
  Build,
  LocalShipping,
  CheckCircle,
  Store,
  Support,
  Payment,
} from '@mui/icons-material';
import SEO from '../components/SEO';
import { generateLocalBusinessSchema } from '../utils/structuredData';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const contactInfo = [
    {
      icon: <Phone />,
      title: 'تلفن',
      details: ['021-12345678', '0912-3456789'],
    },
    {
      icon: <Email />,
      title: 'ایمیل',
      details: ['info@karno.ir', 'support@karno.ir'],
    },
    {
      icon: <LocationOn />,
      title: 'آدرس',
      details: ['تهران، خیابان آزادی، پلاک 123', 'کد پستی: 1234567890'],
    },
    {
      icon: <AccessTime />,
      title: 'ساعات کاری',
      details: ['شنبه تا چهارشنبه: 9 صبح تا 6 عصر', 'پنجشنبه: 9 صبح تا 1 بعد از ظهر'],
    },
    {
      icon: <Support />,
      title: 'پشتیبانی',
      details: ['پشتیبانی آنلاین: 24 ساعته', 'پاسخگویی تلفنی: در ساعات کاری'],
    },
  ];
  
  const services = [
    {
      icon: <DirectionsCar />,
      title: 'قطعات اصلی خودرو',
      description: 'ارائه قطعات اصلی و کمیاب برای انواع خودروهای ایرانی و خارجی با ضمانت اصالت کالا',
    },
    {
      icon: <Build />,
      title: 'قطعات یدکی با کیفیت',
      description: 'تامین قطعات یدکی با کیفیت برای برندهای مختلف خودرو از جمله سایپا، ایران خودرو، ام وی ام و بهمن موتور',
    },
    {
      icon: <LocalShipping />,
      title: 'ارسال سریع',
      description: 'ارسال سریع و مطمئن به سراسر کشور از طریق پست و تیپاکس با امکان رهگیری مرسوله',
    },
    {
      icon: <Payment />,
      title: 'پرداخت امن',
      description: 'پرداخت امن و آسان از طریق درگاه زرین پال با قابلیت پرداخت اقساطی برای خریدهای عمده',
    },
    {
      icon: <Store />,
      title: 'پیش‌فروش خودرو',
      description: 'خدمات پیش‌فروش انواع خودرو با شرایط ویژه و تضمین قیمت و تحویل به موقع',
    },
  ];

  // Create schema for Local Business
  const localBusinessSchema = generateLocalBusinessSchema();
  
  return (
    <>
      <SEO
        title="تماس با ما | کارنو - فروشگاه اینترنتی قطعات خودرو"
        description="تماس با کارنو، فروشگاه اینترنتی قطعات خودرو و لوازم یدکی. راه‌های ارتباطی، ساعات کاری و آدرس فروشگاه"
        canonical="https://karno.ir/contact"
        openGraph={{
          type: 'website',
          title: 'تماس با ما | کارنو - فروشگاه اینترنتی قطعات خودرو',
          description: 'تماس با کارنو، فروشگاه اینترنتی قطعات خودرو و لوازم یدکی. راه‌های ارتباطی، ساعات کاری و آدرس فروشگاه',
          url: 'https://karno.ir/contact',
          image: 'https://karno.ir/images/contact-og.jpg',
        }}
        schema={localBusinessSchema}
      />
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ direction: 'rtl' }}>
          تماس با ما
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          align="center"
          sx={{ mb: 4, direction: 'rtl' }}
        >
          کارنو، مرجع تخصصی فروش قطعات اصلی و کمیاب خودرو و ارائه خدمات پیش‌فروش
        </Typography>
        
        {/* About Us Section */}
        <Box sx={{ mb: 6, textAlign: 'right', direction: 'rtl' }}>
          <Typography variant="body1" paragraph>
            فروشگاه اینترنتی کارنو با هدف تامین قطعات اصلی و کمیاب خودرو برای مشتریان راه‌اندازی شده است. ما با همکاری مستقیم با تولیدکنندگان معتبر داخلی و خارجی، قطعات با کیفیت و اصل را با قیمت مناسب به دست مشتریان می‌رسانیم.
          </Typography>
          <Typography variant="body1" paragraph>
            تیم متخصص ما متشکل از کارشناسان با تجربه در صنعت خودرو است که می‌توانند بهترین راهنمایی را برای انتخاب قطعات مناسب خودروی شما ارائه دهند. همچنین، خدمات پیش‌فروش خودرو با شرایط ویژه از دیگر خدمات ما می‌باشد.
          </Typography>
        </Box>
        
        {/* Tabs for different sections */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="تماس با ما" />
            <Tab label="خدمات ما" />
            <Tab label="سوالات متداول" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ direction: 'rtl' }}>
                  اطلاعات تماس
                </Typography>
                <Box sx={{ mt: 3 }}>
                  {contactInfo.map((info) => (
                    <Paper
                      key={info.title}
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          mr: 2,
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          {info.title}
                        </Typography>
                        {info.details.map((detail) => (
                          <Typography
                            key={detail}
                            variant="body2"
                            color="text.secondary"
                          >
                            {detail}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  ))}
                </Box>
                
                {/* Map */}
                <Box sx={{ mt: 4, borderRadius: 2, overflow: 'hidden' }}>
                  <Typography variant="h6" gutterBottom sx={{ direction: 'rtl' }}>
                    موقعیت ما روی نقشه
                  </Typography>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 1, 
                      height: 200, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: '#f5f5f5'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      نقشه گوگل اینجا نمایش داده می‌شود
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ direction: 'rtl', mb: 3 }}>
                  فرم تماس با ما
                </Typography>
                
                {submitted && (
                  <Alert severity="success" sx={{ mb: 3, direction: 'rtl' }}>
                    با تشکر از پیام شما! کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="نام و نام خانوادگی"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        InputProps={{ sx: { direction: 'rtl' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="ایمیل"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        InputProps={{ sx: { direction: 'ltr' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="شماره تماس"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        InputProps={{ sx: { direction: 'ltr' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="موضوع"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        InputProps={{ sx: { direction: 'rtl' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        label="پیام"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        InputProps={{ sx: { direction: 'rtl' } }}
                        placeholder="لطفا پیام خود را بنویسید. در صورت استعلام قیمت، لطفا مدل خودرو و قطعه مورد نظر را ذکر کنید."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ py: 1.5 }}
                      >
                        ارسال پیام
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {/* Services Tab */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ direction: 'rtl', mb: 4 }}>
              خدمات فروشگاه کارنو
            </Typography>
            
            <Grid container spacing={3}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.title}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4,
                    },
                  }}>
                    <Box sx={{ 
                      p: 2, 
                      display: 'flex', 
                      justifyContent: 'center',
                      bgcolor: 'primary.light',
                      color: 'white'
                    }}>
                      {service.icon}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'right' }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 6, p: 4, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'right' }}>
              <Typography variant="h6" gutterBottom>
                چرا کارنو را انتخاب کنید؟
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="تضمین اصالت کالا و گارانتی قطعات" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="قیمت‌های رقابتی و مناسب" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="ارسال سریع به سراسر کشور" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="پشتیبانی 24 ساعته آنلاین" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="امکان مرجوعی کالا در صورت عدم تطابق با مشخصات" />
                </ListItem>
              </List>
            </Box>
          </Box>
        )}
        
        {/* FAQ Tab */}
        {tabValue === 2 && (
          <Box sx={{ textAlign: 'right', direction: 'rtl' }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              سوالات متداول
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                چگونه می‌توانم سفارش خود را پیگیری کنم؟
              </Typography>
              <Typography variant="body1" paragraph>
                پس از ثبت سفارش، کد رهگیری از طریق پیامک برای شما ارسال می‌شود. با استفاده از این کد می‌توانید در بخش "پیگیری سفارش" در سایت یا از طریق تماس با پشتیبانی، وضعیت سفارش خود را پیگیری نمایید.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                آیا امکان مرجوع کردن کالا وجود دارد؟
              </Typography>
              <Typography variant="body1" paragraph>
                بله، در صورتی که کالای دریافتی با مشخصات ذکر شده در سایت مطابقت نداشته باشد یا دارای نقص فنی باشد، تا 7 روز پس از دریافت می‌توانید کالا را مرجوع نمایید. برای این کار کافیست با پشتیبانی تماس بگیرید.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                هزینه ارسال چقدر است؟
              </Typography>
              <Typography variant="body1" paragraph>
                هزینه ارسال بر اساس وزن کالا، مسافت و روش ارسال متغیر است. برای سفارش‌های بالای 500 هزار تومان، ارسال به صورت رایگان انجام می‌شود. هزینه دقیق ارسال در زمان نهایی کردن سبد خرید محاسبه و نمایش داده می‌شود.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                چگونه می‌توانم از اصل بودن قطعات اطمینان حاصل کنم؟
              </Typography>
              <Typography variant="body1" paragraph>
                تمامی قطعات عرضه شده در فروشگاه کارنو دارای گارانتی اصالت کالا هستند. همچنین برای قطعات اصلی، کد شناسایی و هولوگرام اصالت روی بسته‌بندی درج شده است که می‌توانید از طریق سایت شرکت سازنده آن را استعلام نمایید.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                شرایط پیش‌فروش خودرو چگونه است؟
              </Typography>
              <Typography variant="body1" paragraph>
                برای اطلاع از شرایط پیش‌فروش خودرو، می‌توانید به بخش "پیش‌فروش خودرو" در سایت مراجعه کنید یا با شماره تلفن پشتیبانی تماس بگیرید. شرایط پیش‌فروش شامل مبلغ پیش پرداخت، زمان تحویل، نحوه پرداخت اقساط و سایر جزئیات در آن بخش قابل مشاهده است.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
    </>
  );
};

export default Contact;
