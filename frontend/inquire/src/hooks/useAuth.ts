import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  updateMe,
  refreshToken,
} from '../store/slices/authSlice';
import type { UpdateUserDto } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth,
  );

  const login = useCallback(
    (email: string, password: string) => {
      return dispatch(loginUser({ email, password }));
    },
    [dispatch],
  );

  const register = useCallback(
    (email: string, password: string) => {
      return dispatch(registerUser({ email, password }));
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const loadUser = useCallback(() => {
    dispatch(getMe());
  }, [dispatch]);

  const updateUser = useCallback(
    (data: UpdateUserDto) => {
      dispatch(updateMe(data));
    },
    [dispatch],
  );

  const refresh = useCallback(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return {
    user,
    accessToken,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    loadUser,
    updateUser,
    refresh,
  };
};

export const useAuthEffect = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated]);
};

