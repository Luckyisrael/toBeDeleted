import Toast from 'react-native-toast-message';
import { Logger } from '../utils';
import { useState } from 'react';

const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const showErrorMessage = (message: string) => {
    setAlertMessage(message);
  };

  const clearAlertMessage = () => {
    setAlertMessage(null);
  };

  const successAlert = (response: any) => {
    let message = response;

    // If response is an object with a `message` property, use it
    if (response && typeof response === 'object' && response.message) {
      message = response.message;
    }

    // Ensure message is a string
    if (typeof message !== 'string') {
      message = 'Operation successful!';
    }

    Toast.show({
      type: 'successToast',
      props: { message },
      autoHide: true,
      position: 'bottom',
      visibilityTime: 4000,
      bottomOffset: 40,
    });
  };

  const errorAlert = (err: any, customeerror?: string) => {
    Logger.log(err, 'here is from alert');
    let message = err;
    if (message && typeof message === 'string') {
      message = message;
    } else {
      message = message.message;
    }

    Toast.show({
      type: 'errorToast',
      props: { message: message || customeerror },
      autoHide: true,
      position: 'bottom',
      visibilityTime: 4000,
      bottomOffset: 40,
    });
  };

  const attentionAlert = (customeerror?: string) => {
    Toast.show({
      type: 'attentionToast',
      props: { message: customeerror },
      autoHide: true,
      position: 'bottom',
      visibilityTime: 4000,
      bottomOffset: 70,
    });
  };

  return {
    successAlert,
    errorAlert,
    attentionAlert,
    showErrorMessage,
    clearAlertMessage,
    alertMessage,
  };
};

export default useAlert;
