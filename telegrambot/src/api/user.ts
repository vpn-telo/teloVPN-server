import { axiosServerInstance } from '../plugins/axios';
import { IUserRequest } from '../interfaces/requests/user';
import { EUserRole } from '../enums/user.enum';

interface ICreateUser {
  user_id: number;
  username?: string;
  refer?: string;
}

interface IRemoveUser {
  user_id: number;
}

interface IUpdateUserAfterFirstPay {
  user_id: number;
  expiration_time: number;
  role?: EUserRole
}

interface IUpdateUserPromocode {
  user_id: number;
  promocode: string;
}

export const createUser = async ({ user_id, username, refer }: ICreateUser) => {
  try {
    const user = await axiosServerInstance.post('/user', {
      user_id,
      username,
      refer: Number(refer),
    });
    return user.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const removeUser = async ({ user_id }: IRemoveUser) => {
  try {
    const user = await axiosServerInstance.delete(`/user/${user_id}`);
    return user.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const updateUserAfterFirstPay = async ({
  user_id,
  expiration_time,
}: IUpdateUserAfterFirstPay) => {
  try {
    const user = await axiosServerInstance.post<IUserRequest>(
      '/user/pay/success',
      {
        user_id,
        expiration_time,
      }
    );
    return user.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const updateUserTest = async ({
  user_id,
  expiration_time,
}: IUpdateUserAfterFirstPay) => {
  try {
    const user = await axiosServerInstance.put<IUserRequest>('/user/test', {
      user_id,
      expiration_time: new Date(expiration_time),
    });
    return user.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const updateUser = async ({
  user_id,
  expiration_time,
  role
}: IUpdateUserAfterFirstPay) => {
  try {
    const user = await axiosServerInstance.put<IUserRequest>('/user/', {
      user_id,
      expiration_time: new Date(expiration_time),
    });
    return user.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const updateUserPromocode = async ({
  user_id,
  promocode,
}: IUpdateUserPromocode) => {
  try {
    const user = await axiosServerInstance.put<IUserRequest>('/user/', {
      user_id,
      promocode,
    });
    return user.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUsers = async () => {
  try {
    const users = await axiosServerInstance.get('/users');
    return users.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUser = async (id: number): Promise<any> => {
  try {
    const users = await axiosServerInstance.get(`/user/${id}`);
    return users.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUserNotPayed = async (): Promise<any> => {
  try {
    const users = await axiosServerInstance.get(`/users/notpay`);
    return users.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUserEndSubscription = async (): Promise<any> => {
  try {
    const users = await axiosServerInstance.get(`/users/endsub`);
    return users.data;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUserServer = async (user_id: number) => {
  try {
    const userServer = await axiosServerInstance.get(`/user/server/${user_id}`);
    return userServer.data;
  } catch (e: any) {
    throw new Error(e);
  }
};
