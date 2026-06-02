import { COLORS } from "@/constants/colors";
import { Text, View } from "react-native";

type Props = {
    message: string;
    username: string;
    mine: boolean;
    timestamp: number
}

export default function ChatBubble({ message, username, mine, timestamp }: Props) {

    const time = new Date(timestamp).toLocaleTimeString([],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    )

    return (
        <View style={{
            alignSelf: mine ? "flex-end" : "flex-start",
            maxWidth: "80%",
            backgroundColor: mine ? COLORS.primary : COLORS.card,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: mine ? 20 : 4,
            borderBottomRightRadius: mine ? 4 : 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderWidth: mine ? 0 : 1,
            borderColor: COLORS.border,
            marginBottom: 2
        }}>
            {!mine && (
                <Text style={{
                    color: COLORS.primaryLight,
                    fontSize: 11,
                    marginBottom: 4,
                    letterSpacing: 0.3,
                }}>
                    {username}
                </Text>
            )}
            <View style={{ flexDirection: "column" }}>
                <Text style={{
                    color: COLORS.text,
                    lineHeight: 21,
                    letterSpacing: 0.2
                }}>
                    {message}
                </Text>
                <Text style={{
                    color: mine ? "rgba(255,255,255,.6)" : COLORS.muted,
                    fontSize: 9,
                    marginTop: 4,
                    alignSelf: "flex-end",
                    fontWeight: 500,
                    letterSpacing: 0.1
                }}>
                    {time}
                </Text>
            </View>
        </View>
    )
}