import { Box, Typography } from '@mui/material';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function AboutUsPage() {
  const paragraphs = [
    {
      text:
        'Nestled in the vibrant city of Surat , we started this brand in 2022. ' +
        'Although, we have been in jewellery crafting industry since 1998, we worked' +
        ' on our perfection and then decided to build this brand as we take pride in' +
        ' crafting exquisite handmade Sterling Silver and Gold Jewellery.',
      id: '0',
    },
    {
      text:
        'Elevate your style with our unique and hip-hop designs, and experience' +
        ' the epitome of personalized luxury with our top-notch Custom Jewelry ' +
        'Services.',
      id: '1',
    },
    {
      text:
        'Having a supreme catalogue of our own and crafting according to your custom' +
        ' needs we turn every dream into reality !',
      id: '2',
    },
    {
      text:
        'At Maia Jewellery, we blend tradition with hip-hop and aesthetics,' +
        ' ensuring each piece tells a story as special as you are.',
      id: '3',
    },
    {
      text:
        'Discover the beauty of handcrafted perfection – where passion meets ' +
        'craftsmanship.',
      id: '4',
    },
  ];

  return (
    <CommonPageLayout
      sxBodyProps={{ padding: '16px' }}
      headerProps={{ showBackIcon: true }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', marginBottom: '16px' }}
      >
        About Us
      </Typography>
      <Typography
        variant="h6"
        sx={{ textAlign: 'center', marginBottom: '8px' }}
      >
        Welcome to Maia Jewellery 💎A Sensational Jewellery Brand
      </Typography>
      <Box
        component="ul"
        sx={{
          padding: '0px',
          listStylePosition: 'inside',
        }}
      >
        {paragraphs.map((eachParagraph) => (
          <Box
            key={eachParagraph.id}
            component="li"
            sx={{ margin: '0px 0px 16px 0px' }}
          >
            {eachParagraph.text}
          </Box>
        ))}
      </Box>
    </CommonPageLayout>
  );
}
