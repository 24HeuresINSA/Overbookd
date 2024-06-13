import {
  isSuccess,
  isError,
  type ApiResponse,
  type HttpResponse,
} from "./api-fetch";

type NotificationMessages = {
  success?: string;
  error?: string;
};

export function sendRequestNotification<T extends ApiResponse>(
  res: HttpResponse<T>,
  { success, error }: NotificationMessages,
) {
  const { pushNotification } = useSnackNotificationStore();

  if (isSuccess(res) && success) {
    return pushNotification(success);
  }

  if (isError(res)) {
    const message = error ? error : res.message;
    pushNotification(message);
  }
}
