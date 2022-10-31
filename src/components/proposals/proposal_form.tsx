import {
  DatePickerProps,
  Form as AntdForm,
  Modal,
  ModalProps,
  Space,
} from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import TextArea from "antd/lib/input/TextArea";
import {
  DateField,
  InputField,
  RangeField,
  SelectField,
  TextAreaField,
} from "components/shared/input";
import { Proposal, ProposalStatusList } from "entities/proposal";
import moment, { Moment } from "moment";
import { Form, useForm } from "utils/hooks";

const FormView = (form: Form<Proposal>): JSX.Element => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 24 },
  };
  return (
    <AntdForm {...layout}>
      <InputField label="タイトル" form={form} attr="title" />
      <SelectField
        form={form}
        attr="status"
        label="ステータス"
        selectItems={ProposalStatusList.map((s) => ({
          label: s,
          value: s,
        }))}
      />
      <DateField label="投票期日" form={form} attr="endDate" />
      <TextAreaField
        label="トランザクション"
        form={form}
        attr="transactionCommand"
      />
      <TextAreaField label="詳細" form={form} attr="descriptions" />
      <InputField type="number" label="定足数" form={form} attr="threashold" />
      <InputField type="number" label="賛成数" form={form} attr="forCount" />
      <InputField
        type="number"
        label="反対数"
        form={form}
        attr="againstCount"
      />
    </AntdForm>
  );
};

export type NewProposalFormProps = ModalProps & {
  form: Form<Proposal>;
};

export const NewProposalForm = (props: NewProposalFormProps) => {
  const { form, ...rest } = props;
  return (
    <Modal title="Proposalの新規作成" {...rest}>
      {FormView(form)}
    </Modal>
  );
};

export type EditProposalFormProps = ModalProps & {
  form: Form<Proposal>;
};

export const EditProposalForm = (props: NewProposalFormProps) => {
  const { form, ...rest } = props;
  return (
    <Modal title="Proposalの編集" {...rest}>
      {FormView(form)}
    </Modal>
  );
};
