import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

function optionalRequire(moduleName: string): any | null {
  try {
    return Function("m", "return require(m)")(moduleName);
  } catch {
    return null;
  }
}

export async function takePhotoBase64() {
  const ImagePicker = optionalRequire("expo-image-picker");
  if (!ImagePicker) return null;

  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") return null;
  const result = await ImagePicker.launchCameraAsync({
    base64: true,
    quality: 0.9,
  });
  if (result.canceled || !result.assets?.[0]?.base64) return null;
  return `data:image/jpeg;base64,${result.assets[0].base64}`;
}

export async function pickImageBase64() {
  const ImagePicker = optionalRequire("expo-image-picker");
  if (!ImagePicker) return null;

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    base64: true,
    quality: 0.9,
  });
  if (result.canceled || !result.assets?.[0]?.base64) return null;
  return `data:image/jpeg;base64,${result.assets[0].base64}`;
}

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;
  const pos = await Location.getCurrentPositionAsync({});
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
  };
}

export async function initPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return null;
  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

export async function showLocalNotification(
  title: string,
  body: string
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}

export const saveFile = async (filename: string, data: string) => {
  const FileSystem =
    optionalRequire("expo-file-system/legacy") || optionalRequire("expo-file-system");
  if (!FileSystem?.documentDirectory || !FileSystem.writeAsStringAsync) return null;

  const uri = `${FileSystem.documentDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(uri, data, { encoding: "base64" });
  return uri;
};
