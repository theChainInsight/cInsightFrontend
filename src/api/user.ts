import {
  ApiSet,
  BaseResponse,
  IndexApiSet,
  useDeleteApi,
  useDownloadApi,
  useIndexApi,
  useShowApi,
  usePostApi,
  usePutApi,
} from "utils/network/api_hooks";
import { Form, useEffectSkipFirst } from "utils/hooks";
import { HttpClient } from "../utils/network/axios";

import { User, UserForm, UserSearchForm } from "entities/user";
import { PagingResponse } from "entities";

export type UserResponse = BaseResponse & {
  user: User;
  count?: number;
};

export function useFetchUserApi(): ApiSet<UserResponse> & {
  execute: (eoa: string) => void;
} {
  const api = useShowApi<UserResponse>(new HttpClient(), {
    initialResponse: { user: {} },
  });

  const execute = (eoa: string): void => {
    const apiPath = `users/${eoa}/`;
    api.execute(apiPath);
  };

  return {
    ...api,
    isSuccess: () => !api.loading && !api.isError,
    execute: execute,
  };
}

type UsersResponse = PagingResponse & {
  results: User[];
};

export function useFetchUsersApi(
  searchForm?: Form<UserSearchForm>
): IndexApiSet<UsersResponse> & { execute: () => void } {
  const apiPath = "users/";
  const api = useIndexApi<UsersResponse>(new HttpClient(), {
    initialResponse: { count: 0, results: [] },
    initialState: {
      page: searchForm?.object?.page || 1,
      perPage: searchForm?.object?.perPage || 100000000,
    },
  });

  const execute = (): void => {
    api.execute(apiPath);
  };

  return { ...api, execute: execute };
}

export function useFetchLoginUserApi(): IndexApiSet<UserResponse> & {
  execute: () => void;
} {
  const apiPath = "users/login_user/";
  const api = useIndexApi<UserResponse>(new HttpClient(), {
    initialResponse: { count: 0, user: {} },
  });

  const execute = (): void => {
    api.execute(apiPath);
  };

  return { ...api, execute: execute };
}
