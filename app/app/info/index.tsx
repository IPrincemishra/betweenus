import { Image, Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";

export default function Settings() {
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
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

            <SafeAreaView style={{ flex: 1, padding: 24 }} edges={['top', 'bottom']}>

                <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 40 }}>
                    <View
                        style={{
                            borderColor: COLORS.border,
                            borderWidth: 1,
                            borderRadius: 32,
                            padding: 12,
                            marginBottom: 20,
                            shadowColor: COLORS.primary,
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                            elevation: 5
                        }}
                    >
                        <Image
                            source={require("../../assets/images/icon.png")}
                            style={{ width: 90, height: 90 }}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.text, letterSpacing: -0.5 }}>
                        BetweenUs
                    </Text>

                    <Text style={{ marginTop: 6, fontSize: 14, color: COLORS.muted, fontWeight: "500", textAlign: 'center' }}>
                        Private conversations for two people
                    </Text>
                </View>

                <View style={{ gap: 12 }}>

                    <Pressable
                        onPress={() => Linking.openURL("https://github.com/IPrincemishra/betweenus")}
                        style={{
                            backgroundColor: COLORS.card,
                            borderColor: COLORS.border,
                            borderWidth: 1,
                            paddingHorizontal: 20,
                            paddingVertical: 18,
                            borderRadius: 20,
                            flexDirection: 'row',
                            justifyContent: 'between',
                            alignItems: 'center',
                        }}
                        className="flex-row justify-between items-center"
                    >
                        <View className="flex-row items-center gap-3.5">
                            <Feather name="github" size={20} color={COLORS.primaryLight} />
                            <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "600" }}>
                                Star Repository
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={16} color={COLORS.muted} />
                    </Pressable>

                    <Pressable
                        onPress={() => Linking.openURL("https://instagram.com/prince_mishra._")}
                        style={{
                            backgroundColor: COLORS.card,
                            borderColor: COLORS.border,
                            borderWidth: 1,
                            paddingHorizontal: 20,
                            paddingVertical: 18,
                            borderRadius: 20,
                            flexDirection: 'row',
                            justifyContent: 'between',
                            alignItems: 'center',
                        }}
                        className="flex-row justify-between items-center"
                    >
                        <View className="flex-row items-center gap-3.5">
                            <Feather name="instagram" size={20} color={COLORS.primaryLight} />
                            <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "600" }}>
                                Follow on Instagram
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={16} color={COLORS.muted} />
                    </Pressable>

                </View>

                <View style={{ marginTop: "auto", paddingBottom: 10 }}>
                    <Text
                        style={{
                            color: COLORS.muted,
                            textAlign: "center",
                            fontSize: 12,
                            fontWeight: "500",
                            letterSpacing: 0.3
                        }}
                    >
                        Built with ❤️ by <Text style={{ color: COLORS.primaryLight, fontWeight: '600' }}>Prince</Text>
                    </Text>
                </View>

            </SafeAreaView>
        </View>
    );
}