import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Terms = () => {
  const sections = [
    {
      title: 'Agreement to Terms',
      content: `By accessing and using this website, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the website.`,
    },
    {
      title: 'User Account',
      content: `When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account and password.
        
        You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.`,
    },
    {
      title: 'Products and Orders',
      content: `• All product descriptions are accurate to the best of our knowledge
        • Prices are subject to change without notice
        • We reserve the right to refuse any order
        • Orders are subject to availability
        • Shipping times are estimates only
        • We are not responsible for delivery delays beyond our control`,
    },
    {
      title: 'Product Returns',
      content: `• Returns must be initiated within 30 days of delivery
        • Products must be unused and in original packaging
        • Return shipping costs are the responsibility of the customer
        • Refunds will be processed within 14 business days
        • Some items may be non-returnable for safety or hygiene reasons`,
    },
    {
      title: 'Intellectual Property',
      content: `The website and its original content, features, and functionality are owned by KARNO and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.`,
    },
    {
      title: 'User Content',
      content: `By posting content on our website (such as product reviews), you grant us a non-exclusive, worldwide, royalty-free license to use, modify, publicly display, reproduce, and distribute such content on our website.`,
    },
    {
      title: 'Prohibited Uses',
      content: `You agree not to:
        • Use the website in any unlawful way
        • Attempt to gain unauthorized access to any part of the website
        • Interfere with the proper working of the website
        • Use the website to transmit malicious software
        • Collect user information without consent
        • Impersonate another user or person`,
    },
    {
      title: 'Disclaimer',
      content: `The website is provided "as is" without any representations or warranties, express or implied. We make no representations or warranties regarding the accuracy or completeness of the content.`,
    },
    {
      title: 'Limitation of Liability',
      content: `To the fullest extent permitted by law, KARNO shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the website.`,
    },
    {
      title: 'Governing Law',
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.`,
    },
    {
      title: 'Changes to Terms',
      content: `We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms on this page.
        
        Your continued use of the website after changes are posted constitutes your acceptance of the modified terms.`,
    },
    {
      title: 'Contact Information',
      content: `If you have any questions about these Terms, please contact us at:
        Email: legal@karno.com
        Phone: +1 (555) 123-4567
        Address: 123 Auto Parts Street, Silicon Valley, CA 94025`,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Terms & Conditions
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mb: 6 }}
        >
          Last Updated: May 9, 2025
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Typography variant="body1" paragraph>
            Please read these Terms and Conditions carefully before using our
            website. By accessing or using KARNO's website, you agree to be bound
            by these Terms and Conditions.
          </Typography>

          {sections.map((section) => (
            <Box key={section.title} sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                {section.title}
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ whiteSpace: 'pre-line' }}
              >
                {section.content}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default Terms;
