import React, { useEffect, useState } from "react";

interface Message {
  text: string;
  sender: string;
  timestamp: string;
 
}
import { FlatList, TextInput, Pressable, Text, View, StyleSheet } from "react-native";
import socketServices from "@/src/utils/socketService";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
  ] as Message[]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socketServices.initializeSocket();

    // Listen for incoming messages
    socketServices.on("received_message", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketServices.on("user_joined", (data:Message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data.sender} joined the chat`, timestamp: data.timestamp, sender: "System" },
      ]);
    });

    socketServices.on("user_left", (data:Message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data.sender} left the chat`, timestamp: data.timestamp, sender: "System" },
      ]);
    });

    return () => {
      socketServices.removeListener("received_message");
      socketServices.removeListener("user_joined");
      socketServices.removeListener("user_left");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        sender: "You", // Mark as sent by the current user
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socketServices.emit("send_message", { text: message }); // Only send the text to the server
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={
              item.sender === "You"
                ? styles.sentMessage // Messages sent by the current user
                : styles.receivedMessage // Messages received from others
            }
          >
            <Text style={styles.messageText}>
              {item.sender !== "You" && `${item.sender}: `} {/* Show sender name for received messages */}
              {item.text}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  systemMessage: {
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messageList: {
    padding: 10,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0078fe",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  messageText: {
    color: "#000",
  },
  timestamp: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#0078fe",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});