import { isValidUrl } from '@/utils/isValidUrl';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, Send, Trash2 } from 'lucide-react';
import { FieldArrayWithId, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import '../App.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const schema = z.object({
  links: z.array(
    z.object({
      title: z.string().min(1),
      url: z
        .string()
        .min(1)
        .refine(url => isValidUrl(url), {
          message: 'Invalid URL',
        }),
    })
  ),
});

type ItemFieldArray = FieldArrayWithId<FormValues, 'links', 'id'>;

type FormValues = z.infer<typeof schema>;

export function Form1() {
  const form = useForm<FormValues>({
    defaultValues: {
      links: [],
    },
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const { control, formState } = form;
  const { errors } = formState;

  console.log('errors', errors);

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: 'links',
  });

  const onSubmit = (data: FormValues) => {
    console.log('submitted', data);
  };

  return (
    <div className='grid place-items-center min-h-screen'>
      <div className='w-full max-w-2xl'>
        <h1 className='text-4xl font-bold tracking-tight'>Links</h1>

        <form
          className='mt-10 flex flex-col gap-4'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {fields.length > 0 &&
            fields.map((field: ItemFieldArray, index: number) => (
              <div key={field.id} className='flex gap-4'>
                <div className='flex-1 space-y-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    id='title'
                    {...form.register(`links.${index}.title`)}
                  />
                </div>
                <div className='flex-1 flex gap-4 items-end'>
                  <div className='flex-1'>
                    <div className='flex-1'>
                      <Label htmlFor='url'>URL</Label>
                      <Input
                        id='url'
                        {...form.register(`links.${index}.url`)}
                      />
                    </div>
                    {errors.links?.[index]?.url && (
                      <p className='text-red-500'>
                        {errors.links?.[index]?.url?.message}
                      </p>
                    )}
                  </div>

                  <Button
                    variant='destructive'
                    type='button'
                    onClick={() => remove(index)}
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </div>
              </div>
            ))}

          {fields.length === 0 && (
            <h1 className='text-center text-lg'>
              No links found. Add one to get started.
            </h1>
          )}

          <Button
            className='mt-4 w-full border-dashed'
            type='button'
            onClick={() => prepend({ title: '', url: '' })}
            variant='outline'
          >
            <PlusIcon className='size-4' />
            Add above
          </Button>

          <Button
            className='mt-4 w-full border-dashed'
            type='button'
            onClick={() => append({ title: '', url: '' })}
            variant='outline'
          >
            <PlusIcon className='size-4' />
            Add below
          </Button>

          <Button
            className='mt-4 w-full'
            disabled={!form.formState.isValid}
            type='submit'
          >
            <Send className='size-4' />
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
}
