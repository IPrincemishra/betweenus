import { Text, View } from "react-native";

type Props = {
    message: string;
    username: string;
    mine: boolean
}

export default function ChatBubble({ message, username, mine }: Props) {
    return (
        <View className={`max-w-[80%] rounded-3xl px-4 py-3 ${mine ? "self-end bg-violet-600" : "self-start bg-[#18181B]"}`}>
            {!mine && (
                <Text className="text-zinc-400 text-xs mb-1">
                    {username}
                </Text>
            )}
            <Text className="text-white text-base">
                {message}
            </Text>
        </View>
    )
}