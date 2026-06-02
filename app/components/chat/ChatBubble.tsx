import { COLORS } from "@/constants/colors";
import { Text, View } from "react-native";

type Props = {
    message: string;
    username: string;
    mine: boolean
}

export default function ChatBubble({ message, username, mine }: Props) {
    return (
        <View style={{
            alignSelf: mine ? "flex-end" : "flex-start",
            maxWidth: "80%",
            padding: 14,
            borderRadius: 24,
            backgroundColor: mine ? COLORS.primary : COLORS.card
        }}>
            {!mine && (
                <Text style={{
                    color: COLORS.muted,
                    fontSize: 12,
                    marginBottom: 6
                }}>
                    {username}
                </Text>
            )}
            <Text style={{
                color: COLORS.text
            }}>
                {message}
            </Text>
        </View>
    )
}