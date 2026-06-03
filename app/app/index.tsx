import { COLORS } from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1  items-center justify-center px-6 gap-6" style={{ backgroundColor: COLORS.background }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none" className="overflow-hidden">
        <View
          className="absolute -top-[10%] -right-[15%] w-[320px] h-[320px] rounded-full opacity-[0.08] blur-[80px]"
          style={{ backgroundColor: COLORS.primary }}
        />
        <View
          className="absolute bottom-[25%] -left-[20%] w-[300px] h-[300px] rounded-full opacity-[0.03] blur-[90px]"
          style={{ backgroundColor: COLORS.primaryLight }}
        />
      </View>
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
        style={{ backgroundColor: COLORS.primary }}
        className="w-full rounded-2xl p-5 flex-row justify-center items-center gap-2 "
        onPress={() => {
          router.push("/create")
        }}
      >
        <Feather name="plus" color={COLORS.text} size={18} />
        <Text style={{ color: COLORS.text }} className="font-semibold text-base">
          Create Chat Room
        </Text>
      </Pressable>
      <Pressable
        style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
        className="w-full rounded-2xl p-6 flex-row justify-center items-center gap-2 "
        onPress={() => {
          router.push("/join")
        }}
      >
        <Feather name="log-in" color={COLORS.primaryLight} size={16} />
        <Text style={{ color: COLORS.text }} className="font-semibold text-base">
          Join Chat Room
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          router.push("/info")
        }}
        className="absolute top-16 right-6"
      >
        <Feather name="info" size={24} color={'white'} />
      </Pressable>
    </View>
  )
}