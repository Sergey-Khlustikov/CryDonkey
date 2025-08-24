import { Notify } from 'quasar';
import { ENotifyTypes } from 'src/helpers/notify/structures/notify-types.enum.js';
import { ENotifyPositions } from 'src/helpers/notify/structures/notify-positions.enum.js';

export type TNotifyParams = {
  message: string;
  type: ENotifyTypes;
  position?: ENotifyPositions;
};

export const useNotify = () => {
  const notify = ({
    message = 'Operation successful',
    type = ENotifyTypes.Success,
    position = ENotifyPositions.TopRight,
  }: TNotifyParams) => {
    Notify.create({
      type,
      message,
      position,
      progress: true,
      closeBtn: true,
    });
  };

  const notifySuccess = (message = 'Operation successful') => {
    notify({ message, type: ENotifyTypes.Success });
  };

  const notifyError = (message = 'Operation failed') => {
    notify({ message, type: ENotifyTypes.Error });
  };

  const notifyInfo = (message: string) => {
    notify({ message, type: ENotifyTypes.Info });
  };

  const notifyWarning = (message: string) => {
    notify({ message, type: ENotifyTypes.Warning });
  };

  return {
    notify,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
};
