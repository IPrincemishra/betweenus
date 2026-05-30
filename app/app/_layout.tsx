import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css"

export default function RootLayout() {
  return (
    <SafeAreaView className="bg-red-500 h-44">
      <View className="bg-black">
        <Text className="text-white"> Yo </Text>
      </View>
    </SafeAreaView>
  );
}
