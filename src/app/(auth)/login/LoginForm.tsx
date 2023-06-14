'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';

type LoginFields = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginFields> = async fields => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <label className='flex flex-col gap-2'>
        <span>이메일</span>
        <input
          type='email'
          {...register('email')}
          className='border rounded p-2'
        />
      </label>

      <label className='flex flex-col gap-2'>
        <span>비밀번호</span>
        <input
          type='password'
          {...register('password')}
          className='border rounded p-2'
        />
      </label>

      <button
        type='submit'
        className='py-2 rounded bg-blue-400 hover:bg-blue-300 disabled:bg-gray-200 text-white font-bold'
        disabled={isLoading}
      >
        로그인
      </button>
    </form>
  );
};

export default LoginForm;