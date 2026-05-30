import { Text, TextInput, View } from "react-native"

type Props = {
    value: string,
    onChange: (text: string) => void
}

export default function UsernameInput({ value, onChange }: Props) {
    return (
        <View className="gap-2">
            <Text className="text-zinc-300">Username</Text>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Enter username"
                placeholderTextColor="#666"
                autoCapitalize="none"
                className="bg-zinc-900 text-white rounded-2xl px-5 py-4 border border-zinc-800"
            />
        </View>
    )
}