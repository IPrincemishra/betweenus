import { socket } from "@/services/socket";
import * as Clipboard from "expo-clipboard"
import { router } from "expo-router";
import { Pressable, Share, Text, View } from "react-native";

type Props = {
    roomId: string;
    online: boolean;
    typing: boolean
}

export default function ChatHeader({ online, roomId, typing }: Props) {

    const copyRoom = async () => {
        await Clipboard.setStringAsync(roomId)
    }

    const shareRoom = async () => {
        await Share.share({
            message: `Join my private chat: betweenus://join/${roomId}`
        })
    }

    return (
        <View className="px-5 py-4 border-b border-zinc-900 flex-row justify-between items-center">
            <View>
                <Text className="text-white font-semibold text-lg">
                    BetweenUs
                </Text>
                <Text className="text-zinc-400">
                    {typing ? "Typing..." :
                        online ? "Online" : "Waiting..."
                    }
                </Text>
            </View>
            <View className="flex-row gap-2">
                <Pressable
                    onPress={shareRoom}
                    className="bg-violet-600 px-4 py-2 rounded-xl"
                >
                    <Text className="text-white">
                        Share
                    </Text>
                </Pressable>
                <Pressable onPress={copyRoom} className="bg-zinc-900 px-4 py-2 rounded-xl">
                    <Text className="text-violet-400">
                        Copy
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        socket.disconnect();
                        router.replace("/");
                    }}
                    className="bg-red-500/20 px-4 py-2 rounded-xl "
                >
                    <Text className="text-red-400">
                        Leave
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}