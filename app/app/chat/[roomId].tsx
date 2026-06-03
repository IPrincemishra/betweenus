import ChatBubble from "@/components/chat/ChatBubble";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { COLORS } from "@/constants/colors";
import { SOCKET_EVENTS } from "@/constants/events";
import { socket } from "@/services/socket";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
    username: string;
    message: string;
    timestamp: number;
};

export default function ChatScreen() {

    const { roomId } = useLocalSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false)
    const [memberCount, setMemberCount] = useState(1);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const receive = async (data: Message) => {
            setMessages(prev => [...prev, data]);

            setTimeout(() => {
                flatListRef.current?.scrollToEnd({
                    animated: true
                })
            }, 100);

            await Haptics.impactAsync(
                Haptics.ImpactFeedbackStyle.Light
            )
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

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true)
        });

        const hide = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false)
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={["top", 'bottom']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === "ios" ? "padding" : keyboardVisible
                        ? "padding" : undefined
                }
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ChatHeader
                    online={memberCount >= 2}
                    roomId={String(roomId)}
                    typing={isTyping}
                />
                <View className="flex-1">
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(_, i) => i.toString()}
                        style={{
                            flex: 1
                        }}
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingTop: 20,
                            paddingBottom: 20,
                            gap: 12,
                        }}
                        renderItem={({ item }) => (
                            <ChatBubble
                                message={item.message}
                                username={item.username}
                                mine={item.username === "You"}
                                timestamp={item.timestamp}
                            />
                        )}
                        ListEmptyComponent={
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingTop: 120
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 22,
                                        fontWeight: "700",
                                        color: COLORS.text
                                    }}
                                >
                                    Start your conversation
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 12,
                                        color: COLORS.muted,
                                        textAlign: "center",
                                        paddingHorizontal: 40
                                    }}
                                >
                                    {
                                        memberCount >= 2 ?
                                            "Say hello 👋" : "Waiting for someone to join..."
                                    }
                                </Text>
                            </View>
                        }
                    />
                </View>

                <ChatInput roomId={String(roomId)} onSend={(message) => {
                    socket.emit(
                        SOCKET_EVENTS.SEND_MESSAGE,
                        {
                            roomId, message
                        }
                    );
                    setMessages(prev => [...prev, {
                        username: "You",
                        message,
                        timestamp: Date.now()
                    }]);
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({
                            animated: true
                        })
                    }, 100);
                }}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}