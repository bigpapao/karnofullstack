import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information that you provide directly to us, including when you:
        • Create an account
        • Make a purchase
        • Sign up for our newsletter
        • Contact us for support
        • Participate in surveys or promotions
        
        This information may include your name, email address, shipping address, phone number, and payment information.`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
        • Process your orders and payments
        • Communicate with you about your orders and account
        • Send you marketing communications (with your consent)
        • Improve our website and services
        • Detect and prevent fraud
        • Comply with legal obligations`,
    },
    {
      title: 'Information Sharing',
      content: `We may share your information with:
        • Service providers who assist in our operations
        • Payment processors to process your payments
        • Shipping partners to deliver your orders
        • Law enforcement when required by law
        
        We do not sell your personal information to third parties.`,
    },
    {
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.`,
    },
    {
      title: 'Your Rights',
      content: `You have the right to:
        • Access your personal information
        • Correct inaccurate information
        • Request deletion of your information
        • Opt-out of marketing communications
        • Withdraw consent where applicable`,
    },
    {
      title: 'Cookies',
      content: `We use cookies and similar technologies to:
        • Keep you logged in
        • Remember your preferences
        • Analyze website traffic
        • Personalize content and ads
        
        You can control cookies through your browser settings.`,
    },
    {
      title: 'Updates to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.`,
    },
    {
      title: 'Contact Us',
      content: `If you have any questions about this Privacy Policy, please contact us at:
        Email: privacy@karno.com
        Phone: +1 (555) 123-4567
        Address: 123 Auto Parts Street, Silicon Valley, CA 94025`,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Privacy Policy
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
            At KARNO, we take your privacy seriously. This Privacy Policy describes
            how we collect, use, and protect your personal information when you use
            our website and services.
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

export default PrivacyPolicy;
