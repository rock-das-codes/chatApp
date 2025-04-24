import { Stack } from "expo-router";

export default function RootLayout() {
  return(
  <Stack>
  <Stack.Screen name="screens/Login" options={{ title: "Login" }} />
  <Stack.Screen name="screens/Chat" options={{ title: "Chat" }} />
</Stack>)
}
