import { HStack, IconButton, Input } from "@chakra-ui/react";
import { MinusIcon } from '@chakra-ui/icons';

type EntryProps = {
  content: string | string[];
  onDelete: () => void;
}

const Entry: React.FC<EntryProps> = ({ content, onDelete }) => (
  <HStack p={2} bg='var(--dark-highlight)'>
    {Array.isArray(content) ? content.map((s, idx) => (
      <Input isReadOnly value={s} key={idx} />
    )) : (
      <Input isReadOnly value={content} />
    )}

    <IconButton
      icon={<MinusIcon />}
      isRound
      bg="var(--danger)"
      color="white"
      colorScheme='red'
      size='sm'
      aria-label='Delete entry'
      onClick={onDelete}
    />
  </HStack>
);

export default Entry;
