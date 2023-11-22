import { Box } from '@mui/material';
import { Comment } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  selectedSupportChatUserAtom,
  SupportChatUser,
  supportChatUsersAtom,
} from '@/recoil/atoms/supportChat';

function ChatSessionButton({
  chatSessionsItem,
}: {
  chatSessionsItem: SupportChatUser;
}) {
  // const [loadingSession, setLoadingSession] = useState(false);
  // const user = useRecoilValue(userAtom);
  const setSelectedSupportChatUser = useSetRecoilState(
    selectedSupportChatUserAtom
  );

  const onClickHandler = () => {
    setSelectedSupportChatUser(chatSessionsItem);
    // if (user) {
    //   const sessions = [...chatSessionsItem.sessions].sort(
    //     (prevSession, nextSession) => {
    //       return (
    //         prevSession.createdAt.nanoseconds -
    //         nextSession.createdAt.nanoseconds
    //       );
    //     }
    //   );
    //   if (sessions.length === 0) {
    //     setLoadingSession(true);
    //     try {
    //       const collectionReference = collection(appFirestore, 'supportChats');
    //       await setDoc(doc(collectionReference), {
    //         members: {
    //           [chatSessionsItem.user.uid]: true,
    //           [user.user.uid]: true,
    //         },
    //         createdAt: serverTimestamp(),
    //         updatedAt: serverTimestamp(),
    //       });
    //       const supportChatsQuery = query(
    //         collectionReference,
    //         where(`members.${chatSessionsItem.user.uid}`, '==', true),
    //         where(`members.${user.user.uid}`, '==', true),
    //         orderBy('updatedAt', 'desc'),
    //         limit(1)
    //       );
    //       const chatSessions = await getDocs(supportChatsQuery);
    //       if (!chatSessions.empty) {
    //         const snapShot = chatSessions.docs[0];
    //         setSelectedSupportChatUser({
    //           user: chatSessionsItem.user,
    //           id: snapShot.id,
    //           createdAt: (snapShot.data() as SupportChat).createdAt,
    //           updatedAt: (snapShot.data() as SupportChat).updatedAt,
    //           messages: [],
    //         });
    //       }
    //     } catch (e) {
    //       // Todo: Disallow further clicks and show AlertError here
    //       console.log(e);
    //     } finally {
    //       setLoadingSession(false);
    //     }
    //   } else {
    //     setSelectedSupportChatUser({
    //       ...sessions[0],
    //     });
    //   }
    // }
  };

  return (
    <Button sx={{ justifyContent: 'space-between' }} onClick={onClickHandler}>
      <Box>{chatSessionsItem.user.displayName}</Box>
      <Comment />
    </Button>
  );
}

export default function SelectChatUserComponent() {
  const supportChatUsers = useRecoilValue(supportChatUsersAtom);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flexGrow: 1,
        flexShrink: 1,
        height: '100%',
        width: '100%',
        padding: '12px',
      }}
    >
      <Box
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        Please select executive.
      </Box>
      {Object.keys(supportChatUsers).map((eachUser) => {
        return (
          <ChatSessionButton
            key={eachUser}
            chatSessionsItem={supportChatUsers[eachUser]}
          />
        );
      })}
    </Box>
  );
}
