import { Controller } from 'react-hook-form';
import TiptapEditor from './TipTapEditor';

const RichTextEditor = ({ name, control, placeholder, rules }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue="<p></p>"
      rules={{
        ...rules,
        validate: (value) => {
          const text = value.replace(/<[^>]+>/g, '').trim();
          return text.length > 0 || (rules?.required ?? 'Content is required');
        },
      }}
      render={({ field: { onChange, value } }) => (
        <TiptapEditor
          initialContent={value}
          onContentChange={onChange}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default RichTextEditor;
