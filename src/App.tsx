import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { cn } from './lib/utils';
import { isValidUrl } from './utils/isValidUrl';

const schema = z.object({
  links: z.array(
    z.object({
      title: z.string().min(1, 'Title is required'),
      url: z
        .string()
        .min(1, 'URL is required')
        .refine(url => isValidUrl(url), {
          message: 'Invalid URL',
        }),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

export default function App() {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit: submit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      links: [
        {
          title: 'google',
          url: 'https://google.com',
        },
        {
          title: 'youtube',
          url: 'https://youtube.com',
        },
        {
          title: 'facebook',
          url: 'https://facebook.com',
        },
        {
          title: 'twitter',
          url: 'https://twitter.com',
        },
      ],
    },
  });

  const {
    fields,
    remove,
    append,
    prepend,
    replace,
    insert,
    swap,
    move,
    update,
  } = useFieldArray({
    control,
    name: 'links',
  });

  const handleSubmit = (data: FormValues) => {
    console.log(data);
  };

  const handleReorder = (newOrder: typeof fields) => {
    //parei aqui
    newOrder.forEach((item, index) => {
      console.log(item, index);
    });
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    // container principal
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className='text-2xl font-bold'>Form dinamico</h1>
      {/* container do formulario */}
      <form
        className='w-full max-w-[700px] flex flex-col gap-4'
        onSubmit={submit(handleSubmit)}
      >
        {/* container de inputs */}
        {fields.map(
          (
            field: { id: string; title: string; url: string },
            index: number
          ) => (
            <div
              className={cn('flex gap-2 flex-1 transition-all duration-300')}
              key={field.id}
            >
              <div className='flex flex-col gap-2  flex-1'>
                <Input
                  type='text'
                  placeholder='Title'
                  className='w-full'
                  {...register(`links.${index}.title`)}
                />
                {errors.links?.[index]?.title && (
                  <p className='text-red-500'>
                    {errors.links?.[index]?.title?.message}
                  </p>
                )}
              </div>
              <div className='flex flex-col gap-2  flex-1'>
                <Input
                  type='text'
                  placeholder='URL'
                  className='w-full'
                  {...register(`links.${index}.url`)}
                />
                {errors.links?.[index]?.url && (
                  <p className='text-red-500'>
                    {errors.links?.[index]?.url?.message}
                  </p>
                )}
              </div>
              <Button
                type='button'
                variant='destructive'
                onClick={() => remove(index)}
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>
          )
        )}
        {/* botao de enviar */}
        <Button type='submit'>
          <Send className='w-4 h-4' />
          Enviar
        </Button>

        {/* botoes de acoes */}
        <div className='flex gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => append({ title: '', url: '' })}
          >
            <PlusIcon className='w-4 h-4' />
            Append
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => prepend({ title: '', url: '' })}
          >
            <PlusIcon className='w-4 h-4' />
            Prepend
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              const exists = fields.find(field => field.title === 'teste');
              if (!exists) {
                insert(2, { title: 'teste', url: 'teste' });
              }
            }}
          >
            <PlusIcon className='w-4 h-4' />
            Insert
          </Button>
          <Button type='button' variant='outline' onClick={() => swap(0, 1)}>
            <PlusIcon className='w-4 h-4' />
            Swap
          </Button>
          <Button type='button' variant='outline' onClick={() => move(0, 3)}>
            <PlusIcon className='w-4 h-4' />
            Move
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              const position = fields.findIndex(
                field => field.title === 'twitter'
              );
              if (position !== -1) {
                update(Number(position), {
                  title: 'x(ex-twitter)',
                  url: 'http://www.twitter.com',
                });
              }
            }}
          >
            <PlusIcon className='w-4 h-4' />
            Update
          </Button>
          <Button type='button' variant='outline' onClick={() => replace([])}>
            <PlusIcon className='w-4 h-4' />
            Replace
          </Button>
        </div>
      </form>
    </div>
  );
}
