import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

export function createError(title: string, description: string): void {
  Toast.show({
    type: 'error',
    text1: title,
    text2: description,
  });
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export function createWarning(title: string, description: string): void {
  Toast.show({
    type: 'error',
    text1: title,
    text2: description,
  });
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export function createSuccess(title: string, description: string): void {
  Toast.show({
    type: 'success',
    text1: title,
    text2: description,
  });
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
