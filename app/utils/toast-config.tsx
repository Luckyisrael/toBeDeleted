import { Alerts } from "app/components";

export const ToastConfig: any = {
  errorToast: ({ text1, props }: { text1: string; props: any }) => (
    <Alerts message={props.message} type="error" />
  ),

  successToast: ({ text1, props }: { text1: string; props: any }) => (
    <Alerts message={props.message} type="success" />
  ),

  attentionToast: ({ text1, props }: { text1: string; props: any }) => (
    <Alerts message={props.message} type="attention" />
  ),
};
