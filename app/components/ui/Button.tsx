import { COLORS } from "@/constants/colors";
import { Pressable, Text } from "react-native";

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
};

export default function Button({ title, onPress, disabled }: Props) {

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={{
                backgroundColor: COLORS.primary,
                borderRadius: 20,
                padding: 18,
                alignItems: "center",
                opacity: disabled ? 0.5 : 1
            }}
        >
            <Text style={{
                color: COLORS.text,
                fontWeight: "600",
                fontSize: 16
            }}>
                {title}
            </Text>
        </Pressable>
    )
}