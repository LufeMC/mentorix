import { User } from '../types/user';
import { ApiResponse, api } from './api.service';

const setMailchimp = async (user: User | null) => {
  try {
    await api.post<ApiResponse<string>>('mailchimp', {
      email: user?.email,
      name: user?.name,
      premium: user?.premium,
    });

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return false;
  }
};

const MailchimpService = {
  setMailchimp,
};

export default MailchimpService;
