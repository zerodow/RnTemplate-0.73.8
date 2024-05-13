import {useCallback} from 'react';
import {Keyboard} from 'react-native';
import {handleAlertError} from 'src/api/axios';
import {refLoadingCpn} from 'src/routes';
import {delay} from 'src/utilities/helper/functional';

const useApi = ({requestConfig, apiFunc}) => {
  const {showRefLoading = false} = requestConfig;

  const sendRequest = useCallback(
    async params => {
      Keyboard.dismiss();

      if (showRefLoading) {
        refLoadingCpn?.show();
      }

      await delay(300);

      try {
        const res = await apiFunc(params);
        console.log('res', res);
        //case already handle error -> return null
        if (!res) {
          return;
        }

        return res;
      } catch (error) {
        handleAlertError(error?.message);
        return;
      } finally {
        await delay(300);

        if (showRefLoading) {
          refLoadingCpn?.dismiss();
        }
      }
    },
    [apiFunc, showRefLoading],
  );

  return {
    sendRequest,
  };
};

export default useApi;
