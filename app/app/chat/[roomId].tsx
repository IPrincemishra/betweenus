import ChatBubble from "@/components/chat/ChatBubble";
import ChatHeader from "@/components/chat/ChatHeader";
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
    const [isTyping, setIsTyping] = useState(false)
    const [online, setOnline] = useState(false)

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const receive = (data: Message) => {
            setMessages(prev => [...prev, data]);
        };

        const typingStart = () => {
            setIsTyping(true)
        }

        const typingStop = () => {
            setIsTyping(false)
        }

        const userOnline = () => {
            setOnline(true)
        }

        const userOffline = () => {
            setOnline(false)
        }

        socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, receive);

        socket.on(SOCKET_EVENTS.TYPING_START, typingStart)

        socket.on(SOCKET_EVENTS.TYPING_STOP, typingStop)

        socket.on(SOCKET_EVENTS.USER_ONLINE, userOnline)

        socket.on(SOCKET_EVENTS.USER_OFFLINE, userOffline)

        return () => {
            socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, receive);

            socket.off(SOCKET_EVENTS.TYPING_START, typingStart)

            socket.off(SOCKET_EVENTS.TYPING_STOP, typingStop)

            socket.off(SOCKET_EVENTS.USER_ONLINE, userOnline)

            socket.off(SOCKET_EVENTS.USER_OFFLINE, userOffline)
        };
    }, []);

    const send = () => {
        if (!message.trim()) return;

        const payload = {
            roomId,
            message
        };

        socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);

        socket.emit(SOCKET_EVENTS.TYPING_STOP, roomId)

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

                <ChatHeader
                    online={online}
                    roomId={String(roomId)}
                    typing={isTyping}
                />

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
                        <ChatBubble
                            message={item.message}
                            username={item.username}
                            mine={item.username === "You"}
                        />
                    )}
                />

                <View className="flex-row p-4 gap-3 bg-zinc-950 border-t border-zinc-900">
                    <TextInput
                        value={message}
                        onChangeText={(text) => {
                            setMessage(text)
                            socket.emit(SOCKET_EVENTS.TYPING_START, roomId)
                        }}
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