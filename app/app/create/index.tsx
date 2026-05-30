import UsernameInput from "@/components/UsernameInput";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function CreateScreen() {

    const [username, setUsername] = useState("")

    return (
        <View className="flex-1 bg-zinc-950 px-6 gap-6 justify-center">
            <Text className="text-white text-3xl font-bold">Create Chat</Text>
            <UsernameInput value={username} onChange={setUsername} />
            <Pressable className="bg-white rounded-2xl p-5">
                <Text className="text-center font-semibold">
                    Create Room
                </Text>
            </Pressable>
        </View>
    )
}