import useUserStore from '../stores/userStore';
import { User } from '../types/user';

export default function Test() {
  const userStore = useUserStore();

  const add = () => {
    const user: User = {
      name: 'luis',
      email: '123',
      password: '123',
    };

    userStore.login(user);
  };

  const remove = () => {
    userStore.logout();
  };

  return (
    <div>
      <button onClick={add}>+</button>
      <button onClick={remove}>-</button>
    </div>
  );
}
