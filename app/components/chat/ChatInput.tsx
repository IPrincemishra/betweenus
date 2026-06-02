import { COLORS } from "@/constants/colors";
import { SOCKET_EVENTS } from "@/constants/events";
import { socket } from "@/services/socket";
import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
    roomId: string;
    onSend: (message: string) => void
}

export default function ChatInput({ onSend, roomId }: Props) {

    const [message, setMessage] = useState("")
    const [typingSent, setTypingSent] = useState(false)

    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const send = () => {
        const trimmed = message.trim();

        if (!trimmed)
            return;

        onSend(trimmed);

        socket.emit(
            SOCKET_EVENTS.TYPING_STOP,
            roomId
        );

        setTypingSent(false);
        setMessage("");
    };

    return (
        <View
            style={{
                padding: 12,
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
                backgroundColor: COLORS.background,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
            }}
        >

            <TextInput
                value={message}
                placeholder="Message..."
                placeholderTextColor={COLORS.muted}
                onBlur={() => {
                    socket.emit(
                        SOCKET_EVENTS.TYPING_STOP,
                        roomId
                    )
                }}
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
                style={{
                    flex: 1,
                    backgroundColor: COLORS.card,
                    paddingHorizontal: 18,
                    paddingVertical: 14,
                    borderRadius: 18,
                    color: COLORS.text
                }}
            />
            <Pressable
                onPress={send}
                style={{
                    backgroundColor: COLORS.primary,
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderRadius: 18
                }}
            >
                <Text style={{ color: COLORS.text, fontWeight: "600" }}>
                    Send
                </Text>
            </Pressable>
        </View>
    )
}