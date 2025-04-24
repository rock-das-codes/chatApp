import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

export default function RedirectToLogin() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ChatApp</Text>
      <Pressable style={styles.button} onPress={() => router.push("/screens/Chat")}>
        <Text style={styles.buttonText}>Chat as Anonymous</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push("/screens/Login")}>
        <Text style={styles.buttonText}>Login and Chat</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#0078fe",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});