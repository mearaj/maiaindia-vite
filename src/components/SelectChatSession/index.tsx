import { SupportChatUser } from '@/recoil/atoms/supportChat';
import Button from '@mui/material/Button';
import { useState } from 'react';
import CommonPageLayout from '@/components/Layouts/CommonPage';

interface SelectChatSessionProps {
  supportUser: SupportChatUser;
}

export default function SelectChatSession({
  supportUser,
}: SelectChatSessionProps) {
  const [loadingState, setLoadingState] = useState<'idle' | 'creatingSession'>(
    'idle'
  );

  const createNewSessionHandler = async () => {
    setLoadingState('creatingSession');
    setTimeout(() => {
      setLoadingState('idle');
    }, 3000);
  };

  let buttonText = 'Create New Session';
  if (loadingState === 'creatingSession') {
    buttonText = 'Creating Session...Please wait';
  }

  return (
    <CommonPageLayout
      sxBodyProps={{
        alignItems: 'start',
        justifyContent: 'start',
        flexGrow: 0,
        padding: '16px',
      }}
    >
      {Object.keys(supportUser.sessions).map((eachSession) => {
        return (
          <Button disabled={loadingState !== 'idle'} key={eachSession}>
            {supportUser.sessions[eachSession].id}
          </Button>
        );
      })}
      <Button
        disabled={loadingState !== 'idle'}
        onClick={createNewSessionHandler}
        fullWidth
      >
        {buttonText}
      </Button>
    </CommonPageLayout>
  );
}
