import { Box } from '@mui/material';
import { Comment } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  ChatSession,
  chatSessionsAtom,
  ChatSessionsItem,
  selectedChatSession,
} from '@/recoil/atoms/chatSession';
import { useState } from 'react';
import { Loader } from '@/components';
import { appFirestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from '@firebase/firestore';
import { userAtom } from '@/recoil/atoms';

function ChatSessionButton({
  chatSessionsItem,
}: {
  chatSessionsItem: ChatSessionsItem;
}) {
  const [loadingSession, setLoadingSession] = useState(false);
  const user = useRecoilValue(userAtom);
  const setSelectedChatSession = useSetRecoilState(selectedChatSession);

  const onClickHandler = async () => {
    if (user) {
      const sessions = [...chatSessionsItem.sessions].sort(
        (prevSession, nextSession) => {
          return (
            prevSession.createdAt.nanoseconds -
            nextSession.createdAt.nanoseconds
          );
        }
      );
      if (sessions.length === 0) {
        setLoadingSession(true);
        try {
          const collectionReference = collection(appFirestore, 'supportChats');
          await setDoc(doc(collectionReference), {
            members: { [chatSessionsItem.to.uid]: true, [user.user.uid]: true },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          const supportChatsQuery = query(
            collectionReference,
            where(`members.${chatSessionsItem.to.uid}`, '==', true),
            where(`members.${user.user.uid}`, '==', true),
            orderBy('updatedAt', 'desc'),
            limit(1)
          );
          const chatSessions = await getDocs(supportChatsQuery);
          if (!chatSessions.empty) {
            const snapShot = chatSessions.docs[0];
            setSelectedChatSession({
              to: chatSessionsItem.to,
              id: snapShot.id,
              createdAt: (snapShot.data() as ChatSession).createdAt,
              updatedAt: (snapShot.data() as ChatSession).updatedAt,
              messages: [],
            });
          }
        } catch (e) {
          // Todo: Disallow further clicks and show AlertError here
          console.log(e);
        } finally {
          setLoadingSession(false);
        }
      } else {
        setSelectedChatSession({
          ...sessions[0],
        });
      }
    }
  };

  return (
    <Button sx={{ justifyContent: 'space-between' }} onClick={onClickHandler}>
      {loadingSession ? (
        <Loader />
      ) : (
        <>
          <Box>{chatSessionsItem.to.displayName}</Box>
          <Comment />
        </>
      )}
    </Button>
  );
}

export default function SelectChatUserComponent() {
  const chatSessions = useRecoilValue(chatSessionsAtom);

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
      {Object.keys(chatSessions).map((eachUser) => {
        return (
          <ChatSessionButton
            key={eachUser}
            chatSessionsItem={chatSessions[eachUser]}
          />
        );
      })}
    </Box>
  );
}
