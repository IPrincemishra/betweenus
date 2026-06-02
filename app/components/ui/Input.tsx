import { COLORS } from "@/constants/colors";
import { TextInput } from "react-native";

type Props = {
    value: string;
    onChange: (text: string) => void;
    placeholder: string;
};

export default function Input({ value, onChange, placeholder }: Props) {

    return (
        <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={COLORS.muted}
            style={{
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 18,
                paddingHorizontal: 20,
                paddingVertical: 16,
                color: COLORS.text
            }}
        />
    )
}