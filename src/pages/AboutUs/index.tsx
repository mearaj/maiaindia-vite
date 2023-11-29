import { Box, Typography } from '@mui/material';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function AboutUsPage() {
  const paragraphs = [
    {
      text:
        'Nestled in the vibrant city of Surat , We started this brand in 2022 ' +
        'although we have been in jewellery crafting industry since 1998 we worked' +
        ' on our perfection and then decided to build this Brand as we take pride in' +
        ' crafting exquisite handmade Sterling Silver and Gold Jewellry.',
      id: '0',
    },
    {
      text:
        'Elevate your style with our unique and hip-hop designs, and experience' +
        ' the epitome of personalized luxury with our top-notch Custom jewelry ' +
        'services.',
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
        'At Maia Jewellery, we blend Tradition with Hip-hop and  Aesthetics,' +
        ' ensuring each piece tells a story as special as you are.',
      id: '3',
    },
    {
      text:
        'Discover the beauty of handcrafted perfection – where Passion meets ' +
        'Craftsmanship.',
      id: '4',
    },
  ];

  return (
    <CommonPageLayout sxBodyProps={{ padding: '16px' }}>
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
