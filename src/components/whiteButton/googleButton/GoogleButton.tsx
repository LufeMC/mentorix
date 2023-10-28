import WhiteButton from '../WhiteButton';
import { FcGoogle } from 'react-icons/fc';

interface GoogleButtonProps {
  text: string;
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function GoogleButton(props: GoogleButtonProps) {
  return (
    <WhiteButton
      icon={<FcGoogle />}
      onClick={props.onClick}
      text={`${props.text} with Google`}
      disabled={props.disabled}
    />
  );
}
