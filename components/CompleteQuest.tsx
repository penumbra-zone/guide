import { quests, useQuestStore } from '@/src/store.ts';
import { Button } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

export function CompleteQuest() {
  const { pathname } = useLocation();
  const { markQuestComplete } = useQuestStore();
  const navigate = useNavigate();
  return (
    <Button
      size={'lg'}
      colorScheme={'green'}
      alignSelf={'end'}
      onClick={() => {
        const nextQuest =
          Object.keys(quests)[Object.keys(quests).indexOf(pathname) + 2];
        markQuestComplete(pathname);

        navigate(`/${nextQuest}`);
      }}
    >
      Next
    </Button>
  );
}
