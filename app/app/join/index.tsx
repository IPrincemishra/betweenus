import UsernameInput from "@/components/UsernameInput";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function JoinScreen() {

    const [username, setUsername] = useState("")
    const [roomId, setRoomId] = useState("")

    return (
        <View className="flex-1 bg-zinc-950 px-6 justify-center gap-6">
            <Text className="text-white text-3xl font-bold">Join Chat</Text>
            <UsernameInput value={username} onChange={setUsername} />
            <TextInput
                value={roomId}
                onChangeText={setRoomId}
                placeholder="Room ID"
                placeholderTextColor={"#666"}
                className="bg-zinc-900 text-white rounded-2xl px-5 py-4 border border-zinc-800"
            />
            <Pressable className="bg-white rounded-2xl p-5">
                <Text className="text-center font-semibold">
                    Join Room
                </Text>
            </Pressable>
        </View>
    )
}