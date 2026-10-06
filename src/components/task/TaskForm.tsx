import React from 'react';
import { PlusCircle, Check, X } from 'lucide-react';
import { TaskFormData, NotificationState } from '../../types/task';
import { Panel } from '../common/Panel';
import { SectionHeading } from '../common/SectionHeading';
import { FormField } from '../common/FormField';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { NotificationToast } from '../common/NotificationToast';

interface TaskFormProps {
  formData: TaskFormData;
  isEditing: boolean;
  notification: NotificationState;
  onFieldChange: (field: keyof TaskFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  formData,
  isEditing,
  notification,
  onFieldChange,
  onSubmit,
  onCancelEdit,
}) => {
  const formTitle = isEditing ? 'Editar tarefa' : 'Adicionar tarefa';
  const submitLabel = isEditing ? 'Salvar alterações' : 'Adicionar tarefa';
  const SubmitIcon = isEditing ? Check : PlusCircle;

  return (
    <Panel className="form-panel">
      <SectionHeading
        kicker="Nova entrada"
        title={formTitle}
      >
        {isEditing && (
          <Button
            variant="text"
            icon={<X size={14} />}
            onClick={onCancelEdit}
          >
            Cancelar edição
          </Button>
        )}
      </SectionHeading>

      <form onSubmit={onSubmit}>
        <div className="time-fields">
          <FormField label="Hora inicial" htmlFor="start-time">
            <Input
              id="start-time"
              name="start-time"
              type="time"
              required
              value={formData.start}
              onChange={(e) => onFieldChange('start', e.target.value)}
            />
          </FormField>

          <FormField label="Hora final" htmlFor="end-time">
            <Input
              id="end-time"
              name="end-time"
              type="time"
              required
              value={formData.end}
              onChange={(e) => onFieldChange('end', e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Título" htmlFor="title">
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Ex.: Revisão de código"
            required
            value={formData.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
          />
        </FormField>

        <FormField label="Descrição" htmlFor="description" isOptional>
          <Textarea
            id="description"
            name="description"
            placeholder="O que foi realizado?"
            value={formData.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          icon={<SubmitIcon size={16} />}
        >
          {submitLabel}
        </Button>
      </form>

      <NotificationToast
        message={notification.message}
        type={notification.type}
      />
    </Panel>
  );
};
