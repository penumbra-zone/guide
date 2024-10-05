import { Box, Card, CardBody, Spinner } from '@chakra-ui/react';
import type React from 'react';
import { useConnect } from './hooks';

const Disconnect: React.FC = () => {
  const { connected } = useConnect();
  return (
    <Box py={3} display={'flex'} flexDir={'column'} gap={'2rem'}>
      <Box>
        Once you are done working with a page, you can disconnect your wallet.
        To do this in Prax. You can go to the Settings, click Connected sites,
        and click the trash button next to the site URL. This will disconnect
        the extension from the site, after which the site can no longer access
        your data.
      </Box>
      {connected && (
        <Card w={'full'}>
          <CardBody gap={3} flexDir={'row'} display={'flex'}>
            <Box>Waiting for extension to disconnect</Box>
            <Spinner />
          </CardBody>
        </Card>
      )}
      {!connected && (
        <div>Congratulations. The site can no longer access your data.</div>
      )}
    </Box>
  );
};

export default Disconnect;
