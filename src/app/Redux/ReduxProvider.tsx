"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { useGetProfileQuery } from "./Services/AuthApi";
import { logout as logoutAction, setCredentials, setLoading } from "./slices/AuthSlice";
import { useAppDispatch } from "./hooks";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useGetProfileQuery();

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
      return;
    }

    if (isError || !data?.user) {
      dispatch(logoutAction());
      return;
    }

    if (data.user) {
      dispatch(setCredentials({ user: data.user }));
      return;
    }

    dispatch(setLoading(false));
  }, [data, isLoading, isError, dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
