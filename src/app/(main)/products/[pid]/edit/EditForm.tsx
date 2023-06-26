'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { ChangeEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/libs/api';
import Image from 'next/image';
import { useModal } from '@/store/modalStore';
import NoticeModal from '@/components/modals/NoticeModal';
import { categories } from '@/datas/menuData';
import { Detail } from '@/types';

interface EditFormProps {
  detail: Detail;
  at: string;
  memberId: string;
}

type Image = {
  imgName: string;
  path: string;
};

type UploadFields = {
  pcategory: string;
  pname: string;
  pexplain: string;
  pprice: number;
  access_token: string;
  imageDTOList: Image[];
  pid: number;
};

const EditForm = ({ at, memberId, detail }: EditFormProps) => {
  const router = useRouter();
  const setModal = useModal(s => s.setModal);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<UploadFields>({
    defaultValues: {
      access_token: at,
      ...detail,
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<UploadFields> = async fields => {
    const { imageDTOList, access_token, ...fieldsWithoutImage } = fields;

    setIsLoading(true);

    try {
      await api.patch('/products', {
        productDTO: fieldsWithoutImage,
        jwtRequest: {
          access_token: at,
        },
      });

      router.push(`/products/${detail.pid}`);
      router.refresh();
    } catch (e) {
      setIsLoading(false);
      setModal(<NoticeModal texts={['상품 등록에 실패하였습니다!']} />);
    }
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = async e => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);
    if (fileList.length === 0) return;

    const isOverSize = fileList.some(file => file.size > 10000000);

    if (isOverSize) {
      setModal(
        <NoticeModal texts={['파일 사이즈가 너무 큽니다. (10Mb 제한)']} />
      );

      return;
    }

    const filteredFile = fileList.filter(
      file => !files.find(f => f.name === file.name)
    );

    const newFileList = [...files, ...filteredFile];

    if (newFileList.length > 4) {
      setModal(<NoticeModal texts={['이미지 개수는 4개가 최대입니다.']} />);

      return;
    }

    setFiles([...files, ...filteredFile]);
    e.target.value = '';
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full flex flex-col gap-4'
    >
      <ul className='flex gap-2 mb-4'>
        {categories.map(category => (
          <li key={category}>
            <label>
              <span
                className={`p-2 border rounded cursor-pointer ${
                  watch('pcategory') === category
                    ? 'border-blue-400 bg-blue-400 text-white'
                    : 'bg-white text-gray-400 hover:bg-blue-200'
                }`}
              >
                {category}
              </span>
              <input
                type='radio'
                {...register('pcategory')}
                value={category}
                hidden
              />
            </label>
          </li>
        ))}
      </ul>

      <label className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <span>상품명</span>
          {errors.pname && (
            <span className='text-red-400'>{errors.pname.message}</span>
          )}
        </div>
        <input
          type='text'
          {...register('pname', {
            required: '상품명을 입력해주세요.',
          })}
          className='border rounded p-2'
          placeholder='상품명...'
        />
      </label>

      <div>
        <h2>이미지</h2>

        <ul className='flex gap-4 flex-wrap'>
          {detail.imageDTOList.map(image => (
            <li
              key={image.imgName}
              className='w-[calc(50%-8px)] md:w-[calc((100%-48px)/4)] flex justify-center relative rounded-xl overflow-hidden'
            >
              <Image
                src={image.path}
                alt={image.imgName}
                width={160}
                height={160}
                className='w-full aspect-square object-contain'
              />
            </li>
          ))}
        </ul>
      </div>

      <label className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <span>상품 설명</span>
          {errors.pexplain && (
            <span className='text-red-400'>{errors.pexplain.message}</span>
          )}
        </div>
        <textarea
          {...register('pexplain', {
            required: '상품 설명을 입력해주세요.',
          })}
          className='border rounded p-2 focus:outline-none resize-none'
          placeholder='상품 설명...'
        />
      </label>

      <label className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <span>상품 가격 </span>
          {errors.pprice && (
            <span className='text-red-400'>{errors.pprice.message}</span>
          )}
        </div>
        <input
          type='number'
          {...register('pprice', {
            required: '상품 가격을 입력해주세요.',
          })}
          className='border rounded p-2'
          placeholder='11000...'
        />
      </label>

      <button
        disabled={isLoading}
        className='bg-blue-400 hover:bg-blue-200 font-bold text-white py-2 rounded disabled:bg-gray-200'
      >
        업로드
      </button>
    </form>
  );
};

export default EditForm;