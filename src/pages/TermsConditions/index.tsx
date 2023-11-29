import { Box, Typography } from '@mui/material';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function TermsConditionsPage() {
  const paragraphs = [
    {
      title: 'Shipping of In-Stock Products',
      text:
        'Orders for in-stock products will be processed and shipped on the same' +
        ' day or the next business day.',
      id: '0',
    },
    {
      title: 'Custom Orders',
      text:
        'Customized products require a crafting period of 7-8 days from the date' +
        ' of order confirmation.',
      id: '1',
    },
    {
      title: 'Delivery Time',
      text:
        'The delivery time for all products is subject to the location of delivery.' +
        ' Additional time may be required for remote or international locations.',
      id: '2',
    },
    {
      title: 'Exchange Policy',
      text:
        'In the event of an exchange, the customer is responsible for the cost of' +
        ' shipping the product back to Maia Jewellery.' +
        'The exchanged item should be in its original condition, unworn, and undamaged.',
      id: '3',
    },
    {
      title: 'Liability',
      text:
        'Maia Jewellery is not liable for delays in delivery caused by' +
        ' unforeseen circumstances such as natural disasters, strikes, or any' +
        ' other incidents beyond our control.',
      id: '4',
    },
    {
      title: 'Order Modification',
      text:
        'Once an order is placed, modifications can be made to the product,' +
        ' shipping address, or any other details. Please contact customer support' +
        ' on WhatsApp for any modifications in above.',
      id: '5',
    },
    {
      title: 'Cancellation Policy',
      text: 'Cancellations are not allowed once an order is confirmed and processed.',
      id: '6',
    },
    {
      title: 'Communications',
      text:
        'Customers are encouraged to provide accurate and up-to-date contact ' +
        'information to ensure smooth communication regarding their orders',
      id: '7',
    },
    {
      title: 'Quality Assurance',
      text:
        'Maia Jewellery assures the quality of its products and stands behind ' +
        'their craftsmanship. If you have concerns about the received product, ' +
        'please contact our customer support within [number of days] days of delivery.',
      id: '8',
    },
    {
      title: '',
      text:
        'By placing an order with Maia Jewellery, you agree to these terms and conditions.' +
        ' We reserve the right to update or modify these terms at any time, and it is the' +
        " customer's responsibility to stay informed about any changes.",
      id: '9',
    },
  ];

  return (
    <CommonPageLayout sxBodyProps={{ padding: '16px' }}>
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', marginBottom: '16px' }}
      >
        Terms And Conditions
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
