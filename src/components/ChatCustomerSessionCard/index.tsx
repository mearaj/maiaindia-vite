import { Box, Card, Menu, MenuItem } from '@mui/material';
import { userPlaceholderSvgUrl } from '@/recoil/data/user';
import { SupportChatSession } from '@/recoil/data/supportChat';
import { useRecoilValue } from 'recoil';
import { adminUsersAtom } from '@/recoil/atoms/admin';
import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { KeyboardArrowDown } from '@mui/icons-material';

export default function ChatCustomerCardComponent({
  chatSession,
}: {
  chatSession: SupportChatSession;
}) {
  const admins = useRecoilValue(adminUsersAtom);
  const [selectedExecutiveID, setSelectedExecutiveID] = useState(
    chatSession.executiveID
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleExecutiveChange = (executiveID: string) => {
    setAnchorEl(null);
    setSelectedExecutiveID(executiveID);
  };

  const handleCardClick = () => {
    console.log('called');
  };

  return (
    <Card
      sx={{
        '&:active,&:hover': {
          boxShadow: 24,
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ padding: '16px' }}>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              height: '50px',
              width: '50px',
              borderRadius: '50%',
              marginRight: '8px',
            }}
          >
            <img
              src={
                chatSession.customerProfile?.photoURL ?? userPlaceholderSvgUrl
              }
              height="100%"
              width="100%"
              alt="executive profile"
            />
          </Box>
          <Box>
            <Box>{chatSession.customerProfile?.displayName ?? 'N/A'}</Box>
            <Box>{chatSession.customerProfile?.email ?? 'N/A'}</Box>
            <Box sx={{ marginBottom: '16px' }}>
              {chatSession.messages &&
                chatSession.messages.length > 0 &&
                chatSession.messages[chatSession.messages.length - 1].text}
            </Box>
          </Box>
        </Box>
        <Box>
          <Box sx={{ marginBottom: '16px' }}>
            <Button
              sx={{
                textTransform: 'none',
                justifyContent: 'space-between',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: '0px',
              }}
              id="assign-handler-button"
              variant="outlined"
              onClick={handleClick}
              fullWidth
              endIcon={<KeyboardArrowDown />}
            >
              {selectedExecutiveID
                ? admins[selectedExecutiveID]?.displayName ??
                  selectedExecutiveID
                : 'Assign Handler'}
            </Button>
            <Menu
              id="assign-handler-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  width: '100%',
                },
              }}
              MenuListProps={{
                'aria-labelledby': 'assign-handler-menu',
              }}
            >
              {Object.keys(admins).map((adminID) => {
                return (
                  <MenuItem
                    key={adminID}
                    sx={{ minHeight: '0px' }}
                    onClick={() => handleExecutiveChange(adminID)}
                  >
                    {admins[adminID]?.displayName ?? adminID}
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
          <Box sx={{ width: '80px', flexShrink: 0 }}>
            <Button
              sx={{
                minHeight: '0px',
                minWidth: '0px',
              }}
              fullWidth
              variant="outlined"
              onClick={() => {}}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
