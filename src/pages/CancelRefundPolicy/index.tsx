import { Box, Typography } from '@mui/material';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function CancelRefundPolicy() {
  const paragraphs = [
    {
      title: '',
      text:
        'At Maia Jewellery, each piece is meticulously handcrafted with utmost' +
        'care and attention to detail. We understand the importance of your' +
        'purchase and assure you of the finest quality.',
      id: '0',
    },
    {
      title: 'Warranty',
      text:
        'We stand behind the quality of our products. Maia Jewellery provides' +
        ' a 6-month warranty on the shining diamonds and polish of our jewelry.' +
        ' This warranty covers manufacturing defects and ensures your continued ' +
        'satisfaction with our pieces.',
      id: '1',
    },
    {
      title: 'Exchange',
      text:
        'In the event that you are dissatisfied with your purchase due to sizing ' +
        'issues or personal preference, we offer an exchange policy. You may exchange ' +
        'your unworn and undamaged item within 7 days of receiving your order. ' +
        'Where Customer is Liable of Reverse Shipping.',
      id: '2',
    },
    {
      title: 'Cancellation',
      text:
        'We regret to inform you that we do not entertain order cancellations once the' +
        ' transaction is complete. As each item is crafted to order, we proceed with ' +
        'production promptly to ensure timely delivery.',
      id: '3',
    },
    {
      title: 'Refund',
      text:
        'Maia Jewellery operates on a no-refund policy. Once an order is confirmed' +
        ' and processed, refunds will not be issued under any circumstances.',
      id: '4',
    },
    {
      title: '',
      text:
        'Rest assured, our commitment to excellence means you can shop with confidence' +
        ' at Maia Jewellery. If you have any concerns or queries, please reach out to' +
        ' our customer support team, and we will be delighted to assist you.',
      id: '5',
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
        Cancellation And Exchange/Refund Policies
      </Typography>
      {paragraphs.map((eachParagraph) => (
        <Box key={eachParagraph.id} sx={{ marginBottom: '16px' }}>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {eachParagraph.title}
          </Typography>
          <Box>{eachParagraph.text}</Box>
        </Box>
      ))}
    </CommonPageLayout>
  );
}
