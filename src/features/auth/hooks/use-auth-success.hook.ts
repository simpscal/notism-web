import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { tokenManagerUtils } from '@/shared/utils';

import { LoginVM } from '../models';

export const useAuthSuccess = () => {
  const dispatch = useDispatch();

  const handleAuthSuccess = (viewModel: LoginVM, successMessage: string) => {
    tokenManagerUtils.setToken(viewModel.token);
    tokenManagerUtils.setRefreshToken(viewModel.refreshToken);

    toast.success('Success', {
      description: successMessage
    });
  };

  return {
    handleAuthSuccess,
  };
};
