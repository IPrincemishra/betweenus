import { View } from "react-native";

type Props = {
    children: React.ReactNode;
};

export default function Screen({ children }: Props) {

    return (
        <View className="flex-1 bg-[#0A0A0A] px-6"        >
            {children}
        </View>
    )
}