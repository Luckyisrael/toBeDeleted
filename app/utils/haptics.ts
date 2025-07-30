import * as Haptics from 'expo-haptics';

export enum HapticFeedbackType {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
}

export const triggerHaptic = async (
  type: HapticFeedbackType = HapticFeedbackType.Medium,
) => {
  try {
    switch (type) {
      case HapticFeedbackType.Light:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case HapticFeedbackType.Medium:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case HapticFeedbackType.Heavy:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case HapticFeedbackType.Success:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case HapticFeedbackType.Error:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case HapticFeedbackType.Warning:
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Fallback
    }
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};