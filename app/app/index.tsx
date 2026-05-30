import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-zinc-950 items-center justify-center px-6 gap-6">
      <Text className="text-white text-4xl font-bold">
        Temp Chat
      </Text>
      <Text className="text-zinc-400 text-center">
        Private temporary conversations
      </Text>
      <Pressable
        className="w-full rounded-2xl bg-zinc-800 p-5"
        onPress={() => {
          router.push("/create")
        }}
      >
        <Text className="text-center text-white text-lg">
          Create Chat Room
        </Text>
      </Pressable>
      <Pressable
        className="w-full rounded-2xl bg-zinc-800 p-5"
        onPress={() => {
          router.push("/join")
        }}
      >
        <Text className="text-center text-white text-lg">
          Join Chat Room
        </Text>
      </Pressable>
    </View>
  )
}