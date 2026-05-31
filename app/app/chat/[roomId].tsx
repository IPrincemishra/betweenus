import { SOCKET_EVENTS } from "@/constants/events";
import { socket } from "@/services/socket";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { FlatList, Pressable, Text, TextInput, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
    username: string;
    message: string;
    timestamp: number;
};

export default function ChatScreen() {
    const { roomId } = useLocalSearchParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    // Create a ref for the FlatList to scroll to the bottom automatically
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const receive = (data: Message) => {
            setMessages(prev => [...prev, data]);
        };

        socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, receive);

        return () => {
            socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, receive);
        };
    }, []);

    const send = () => {
        if (!message.trim()) return;

        const payload = {
            roomId,
            message
        };

        socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);

        setMessages(prev => [
            ...prev,
            {
                username: "You",
                message,
                timestamp: Date.now()
            }
        ]);

        setMessage("");
    };

    return (
        <SafeAreaView className="flex-1 bg-zinc-950" >
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(_, i) => i.toString()}
                    contentContainerStyle={{
                        padding: 20,
                        gap: 12
                    }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    renderItem={({ item }) => (
                        <View className={`rounded-2xl p-4 max-w-[80%] ${item.username === "You"
                            ? "bg-white align-self-end ml-auto"
                            : "bg-zinc-900 mr-auto"
                            }`}>
                            {item.username !== "You" && (
                                <Text className="text-zinc-400 text-xs mb-1">{item.username}</Text>
                            )}
                            <Text className={item.username === "You" ? "text-zinc-950" : "text-white"}>
                                {item.message}
                            </Text>
                        </View>
                    )}
                />

                <View className="flex-row p-4 gap-3 bg-zinc-950 border-t border-zinc-900">
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Message..."
                        placeholderTextColor={"#666"}
                        className="flex-1 bg-zinc-900 text-white rounded-xl px-4 py-4"
                        multiline={false}
                    />
                    <Pressable
                        onPress={send}
                        className="bg-white px-6 rounded-xl justify-center active:opacity-80"
                    >
                        <Text className="font-semibold text-zinc-950">Send</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}