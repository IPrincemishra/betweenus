import { COLORS } from "@/constants/colors";
import { View } from "react-native";

type Props = {
    children: React.ReactNode;
};

export default function Screen({ children }: Props) {

    return (
        <View style={{
            flex: 1,
            backgroundColor: COLORS.background,
            paddingHorizontal: 24
        }}>
            {children}
        </View>
    )
}