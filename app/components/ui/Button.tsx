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
            className="bg-violet-600 rounded-2xl p-5 items-center active:opacity-80"
        >
            <Text className="text-white font-semibold text-base"            >
                {title}
            </Text>
        </Pressable>
    )
}