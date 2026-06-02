import { COLORS } from "@/constants/colors";
import { socket } from "@/services/socket";
import * as Clipboard from "expo-clipboard"
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons"

type Props = {
    username?: string;
    roomId: string;
    online: boolean;
    typing: boolean
}

export default function ChatHeader({ online, roomId, typing, username }: Props) {

    const [copied, setCopied] = useState(false)

    const copyRoom = async () => {
        await Clipboard.setStringAsync(roomId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareRoom = async () => {
        await Share.share({
            message: `Join my private chat: betweenus://join/${roomId}`
        })
    }



    return (
        <View className={`px-5 py-4 border-b flex-row justify-between items-center`}
            style={{
                borderBottomColor: COLORS.border
            }}>
            <View className="flex-row items-center gap-3">
                <View>
                    <Text className="font-bold text-lg tracking-tight" style={{ color: COLORS.text }}>
                        BetweenUs
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                        <Text
                            className="text-xs font-medium"
                            style={{ color: COLORS.muted }}
                        >
                            {
                                typing ? "Typing..." : online ? "Online" : "Waiting..."
                            }
                        </Text>
                    </View>
                </View>
            </View>
            <View className="flex-row items-center gap-2">
                <Pressable
                    onPress={shareRoom}
                    style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
                    className="w-10 h-10 rounded-xl justify-center items-center border active:opacity-70"
                >
                    <Feather name="share-2" size={18} color={COLORS.text} />
                </Pressable>
                <Pressable
                    onPress={copyRoom}
                    style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
                    className="w-10 h-10 rounded-xl justify-center items-center border active:opacity-70"
                >
                    <Ionicons
                        name={copied ? "checkmark-done" : "copy-outline"}
                        size={18}
                        color={copied ? COLORS.success : COLORS.text}
                    />
                </Pressable>
                <View className="w-[1px] h-6 mx-1" style={{ backgroundColor: COLORS.border }} />
                <Pressable
                    onPress={() => {
                        socket.disconnect();
                        router.replace("/");
                    }}
                    style={{ backgroundColor: `${COLORS.danger}15` }}
                    className="h-10 px-4 rounded-xl flex-row items-center gap-1.5 active:opacity-70"
                >
                    <Ionicons name="log-out-outline" size={16} color={COLORS.danger} />
                    <Text className="font-semibold text-xs" style={{ color: COLORS.danger }}>
                        Leave
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}