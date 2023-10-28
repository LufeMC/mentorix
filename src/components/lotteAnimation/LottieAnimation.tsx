import { Player, Controls } from '@lottiefiles/react-lottie-player';
import Cook from '../../assets/jsons/cook.json';

const LottieAnimation = () => {
  return (
    <Player autoplay loop src={Cook} style={{ width: '100%' }}>
      <Controls visible={false} />
    </Player>
  );
};

export default LottieAnimation;
