import { Box, Typography } from '@mui/material';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function PrivacyPolicyPage() {
  const startParagraphs = [
    {
      id: 'startParagraphs-1',
      text:
        'At Maia Jewellery, accessible from maiaindia.com, one of our main' +
        'priorities is the privacy of our visitors. This Privacy Policy document' +
        'contains types of information that is collected and recorded by Maia' +
        'Jewellery and how we use it.',
    },
    {
      id: 'startParagraphs-2',
      text:
        'If you have additional questions or require more information about our' +
        'Privacy Policy, do not hesitate to contact us.',
    },
    {
      id: 'startParagraphs-3',
      text:
        'This Privacy Policy applies only to our online activities and is valid' +
        'for visitors to our website with regards to the information that they' +
        'shared and/or collect in Maia Jewellery. This policy is not applicable' +
        'to any information collected offline or via channels other than this' +
        'website.',
    },
  ];

  const howWeCollectInfoParagraphs = [
    {
      id: 'informationCollection-1',
      text:
        'The personal information that you are asked to provide, and the reasons' +
        'why you are asked to provide it, will be made clear to you at the point' +
        'we ask you to provide your personal information.',
    },
    {
      id: 'informationCollection-2',
      text:
        'If you contact us directly, we may receive additional information about' +
        'you such as your name, email address, phone number, the contents of the' +
        'message and/or attachments you may send us, and any other information' +
        'you may choose to provide.',
    },
    {
      id: 'informationCollection-3',
      text:
        'When you register for an Account, we may ask for your contact' +
        'information, including items such as name, company name, address, email' +
        'address, and telephone number.',
    },
  ];

  const howWeUseInfoItems = [
    {
      id: 'howWeUseInfoItems-1',
      text: 'Provide, operate, and maintain our website',
    },
    {
      id: 'howWeUseInfoItems-2',
      text: 'Improve, personalize, and expand our website',
    },
    {
      id: 'howWeUseInfoItems-3',
      text: 'Understand and analyze how you use our website',
    },
    {
      id: 'howWeUseInfoItems-4',
      text: 'Develop new products, services, features, and functionality',
    },
    {
      id: 'howWeUseInfoItems-5',
      text:
        'Communicate with you, either directly or through one of our partners,' +
        'including for customer service, to provide you with updates and other' +
        'information relating to the website, and for marketing and promotional' +
        'purposes',
    },
    {
      id: 'howWeUseInfoItems-6',
      text: 'Send you emails',
    },
    {
      id: 'howWeUseInfoItems-7',
      text: 'Find and prevent fraud',
    },
  ];

  return (
    <CommonPageLayout sxBodyProps={{ padding: '16px' }}>
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', marginBottom: '16px' }}
      >
        Privacy Policy for Maia Jewellery
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        {startParagraphs.map((eachParagraph) => (
          <Box key={eachParagraph.id} sx={{ marginBottom: '8px' }}>
            <Box>{eachParagraph.text}</Box>
          </Box>
        ))}
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Consent
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        By using our website, you hereby consent to our Privacy Policy and agree
        to its terms.
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Information we collect
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        {howWeCollectInfoParagraphs.map((eachParagraph) => (
          <Box key={eachParagraph.id} sx={{ marginBottom: '8px' }}>
            <Box>{eachParagraph.text}</Box>
          </Box>
        ))}
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        How we use your information
      </Typography>
      <Box>
        We use the information we collect in various ways, including to:
      </Box>
      <Box
        component="ul"
        sx={{
          listStylePosition: 'outside',
        }}
      >
        {howWeUseInfoItems.map((infoItem) => (
          <Box
            key={infoItem.id}
            component="li"
            sx={{ margin: '0px 0px 4px 0px' }}
          >
            {infoItem.text}
          </Box>
        ))}
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Log Files
      </Typography>

      <Box sx={{ marginBottom: '16px' }}>
        Maia Jewellery follows a standard procedure of using log files. These
        files log visitors when they visit websites. All hosting companies do
        this and a part of hosting services' analytics. The information
        collected by log files include internet protocol (IP) addresses, browser
        type, Internet Service Provider (ISP), date and time stamp,
        referring/exit pages, and possibly the number of clicks. These are not
        linked to any information that is personally identifiable. The purpose
        of the information is for analyzing trends, administering the site,
        tracking user's movement on the website, and gathering demographic
        information.
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Advertising Partners Privacy Policies
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        <Box sx={{ marginBottom: '8px' }}>
          You may consult this list to find the Privacy Policy for each of the
          advertising partners of Maia Jewellery.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          Third-party ad servers or ad networks uses technologies like cookies,
          JavaScript, or Web Beacons that are used in their respective
          advertisements and links that appear on Maia Jewellery, which are sent
          directly to user's browser. They automatically receive your IP address
          when this occurs. These technologies are used to measure the
          effectiveness of their advertising campaigns and/or to personalize the
          advertising content that you see on websites that you visit.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          Note that Maia Jewellery has no access to or control over these
          cookies that are used by third-party advertisers.
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Third Party Privacy Policies
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        <Box sx={{ marginBottom: '8px' }}>
          Maia Jewellery's Privacy Policy does not apply to other advertisers or
          websites. Thus, we are advising you to consult the respective Privacy
          Policies of these third-party ad servers for more detailed
          information. It may include their practices and instructions about how
          to opt-out of certain options.{' '}
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          You can choose to disable cookies through your individual browser
          options. To know more detailed information about cookie management
          with specific web browsers, it can be found at the browser's
          respective websites.
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        CCPA Privacy Rights (Do Not Sell My Personal Information)
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        <Box sx={{ marginBottom: '8px' }}>
          Under the CCPA, among other rights, California consumers have the
          right to:
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          Request that a business that collects a consumer's personal data
          disclose the categories and specific pieces of personal data that a
          business has collected about consumers.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          Request that a business delete any personal data about the consumer
          that a business has collected.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          Request that a business that sells a consumer's personal data, not
          sell the consumer's personal data.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us.
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        GDPR Data Protection Rights
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        <Box sx={{ marginBottom: '8px' }}>
          We would like to make sure you are fully aware of all of your data
          protection rights. Every user is entitled to the following:
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          The right to access – You have the right to request copies of your
          personal data. We may charge you a small fee for this service.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          The right to rectification – You have the right to request that we
          correct any information you believe is inaccurate. You also have the
          right to request that we complete the information you believe is
          incomplete.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          The right to erasure – You have the right to request that we erase
          your personal data, under certain conditions.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          The right to restrict processing – You have the right to request that
          we restrict the processing of your personal data, under certain
          conditions.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          The right to object to processing – You have the right to object to
          our processing of your personal data, under certain conditions.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          The right to data portability – You have the right to request that we
          transfer the data that we have collected to another organization, or
          directly to you, under certain conditions.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us.
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Children&apos;s Information
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        <Box sx={{ marginBottom: '8px' }}>
          Another part of our priority is adding protection for children while
          using the internet. We encourage parents and guardians to observe,
          participate in, and/or monitor and guide their online activity.
        </Box>
        <Box sx={{ marginBottom: '8px' }}>
          Maia Jewellery does not knowingly collect any Personal Identifiable
          Information from children under the age of 13. If you think that your
          child provided this kind of information on our website, we strongly
          encourage you to contact us immediately and we will do our best
          efforts to promptly remove such information from our records.
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Changes to This Privacy Policy
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        <Box sx={{ marginBottom: '8px' }}>
          We may update our Privacy Policy from time to time. Thus, we advise
          you to review this page periodically for any changes. We will notify
          you of any changes by posting the new Privacy Policy on this page.
          These changes are effective immediately, after they are posted on this
          page.
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Contact Us
      </Typography>
      <Box sx={{ marginBottom: '16px' }}>
        <Box sx={{ marginBottom: '8px' }}>
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us.
        </Box>
      </Box>
    </CommonPageLayout>
  );
}
