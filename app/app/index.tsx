import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-zinc-950 items-center justify-center px-6 gap-6">
      <Image
        source={require("../assets/images/android-icon-foreground.png")}
        className="w-28 h-28"
        resizeMode="contain"
      />
      <Text className="text-4xl font-bold text-white">
        BetweenUs
      </Text>
      <Text className="text-zinc-400 text-center">
        Private conversations for two people
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