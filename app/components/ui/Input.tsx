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
            placeholderTextColor="#777"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white"
        />
    )
}