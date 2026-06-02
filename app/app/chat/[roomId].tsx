import ChatBubble from "@/components/chat/ChatBubble";
import ChatHeader from "@/components/chat/ChatHeader";
import { COLORS } from "@/constants/colors";
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
    const [memberCount, setMemberCount] = useState(1);
    const [typingSent, setTypingSent] = useState(false)

    const flatListRef = useRef<FlatList>(null);

    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

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

        const userOnline = (count: number) => {
            setMemberCount(count)
        }

        const userOffline = (count: number) => {
            setMemberCount(count)
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

    useEffect(() => {
        return () => {
            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current)
            }
        }
    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: COLORS.background
        }} >
            <View className="absolute inset-0 overflow-hidden pointer-events-none">
                <View
                    className="absolute -top-[15%] -right-[15%] w-[320px] h-[320px] rounded-full opacity-[0.12] blur-[80px]"
                    style={{ backgroundColor: COLORS.primary }}
                />
                <View
                    className="absolute bottom-[15%] -left-[20%] w-[380px] h-[380px] rounded-full opacity-[0.06] blur-[100px]"
                    style={{ backgroundColor: COLORS.primaryLight }}
                />
            </View>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ChatHeader
                    online={memberCount >= 2}
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

                <View className="flex-row p-4 gap-3 items-center"

                >
                    <TextInput
                        value={message}
                        onChangeText={(text) => {
                            setMessage(text);
                            const trimmed = text.trim();

                            if (trimmed.length === 0) {
                                socket.emit(
                                    SOCKET_EVENTS.TYPING_STOP,
                                    roomId
                                );
                                setTypingSent(false);
                                return;
                            }

                            if (!typingSent) {
                                socket.emit(
                                    SOCKET_EVENTS.TYPING_START,
                                    roomId
                                );
                                setTypingSent(true);
                            }

                            if (typingTimeout.current) {
                                clearTimeout(typingTimeout.current);
                            }

                            typingTimeout.current = setTimeout(() => {
                                socket.emit(
                                    SOCKET_EVENTS.TYPING_STOP,
                                    roomId
                                );
                                setTypingSent(false);
                            }, 1000);
                        }}
                        onBlur={() => {
                            socket.emit(
                                SOCKET_EVENTS.TYPING_STOP,
                                roomId
                            );
                        }}
                        placeholder="Message..."
                        placeholderTextColor={"#666"}
                        style={{
                            backgroundColor: COLORS.card,
                            borderColor: COLORS.border,
                            color: COLORS.text
                        }}
                        className="flex-1 rounded-xl px-4 py-3.5 border"
                        multiline={false}
                    />
                    <Pressable
                        onPress={send}
                        style={{ backgroundColor: COLORS.primary }}
                        disabled={!socket.connected}
                        className="h-[42px] px-6 rounded-xl justify-center items-center active:opacity-80"
                    >
                        <Text className="font-semibold" style={{ color: COLORS.text }}>Send</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}