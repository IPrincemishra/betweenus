import Screen from "@/components/ui/Screen";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import UsernameInput from "../../components/UsernameInput";
import { SOCKET_EVENTS } from "../../constants/events";
import { socket } from "../../services/socket";
import { useSessionStore } from "../../stores/useSessionStore";
import { Feather } from "@expo/vector-icons";
export default function CreateScreen() {

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false)

    const {
        setUsername: saveUsername,
        setRoomId
    } = useSessionStore();

    const usernameRef = useRef(username);
    useEffect(() => {
        usernameRef.current = username;
    }, [username]);

    useEffect(() => {
        const onSuccess = () => {
            socket.emit(
                SOCKET_EVENTS.CREATE_ROOM
            )
        };
        const onError = (msg: string) => {
            setLoading(false)
            Alert.alert(msg)
        };
        const onRoomCreated = (data: any) => {
            setLoading(false)
            saveUsername(usernameRef.current);
            setRoomId(data.roomId);
            router.replace(`/chat/${data.roomId}?creator=true`);
        };

        socket.on(
            SOCKET_EVENTS.USERNAME_SUCCESS,
            onSuccess
        );
        socket.on(
            SOCKET_EVENTS.USERNAME_ERROR,
            onError
        );

        socket.on(
            SOCKET_EVENTS.ROOM_CREATED,
            onRoomCreated
        );

        return () => {
            socket.off(
                SOCKET_EVENTS.USERNAME_SUCCESS,
                onSuccess
            );

            socket.off(
                SOCKET_EVENTS.USERNAME_ERROR,
                onError
            );

            socket.off(
                SOCKET_EVENTS.ROOM_CREATED,
                onRoomCreated
            );

        };

    }, []);

    const createRoom = () => {

        if (!username.trim()) {
            Alert.alert("Enter username");
            return;
        }
        setLoading(true)
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit(
            SOCKET_EVENTS.SET_USERNAME,
            username.trim()
        );

    };

    return (
        <Screen>
            <View className="flex-1  px-6 justify-center gap-6" >
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
                <Text className="text-white text-3xl font-bold">
                    Create Chat
                </Text>
                <UsernameInput
                    value={username}
                    onChange={setUsername}
                />
                <Pressable
                    style={{
                        backgroundColor: loading ? `${COLORS.primary}80` : COLORS.primary,
                    }}
                    disabled={loading}
                    className="w-full h-[56px] rounded-2xl flex-row justify-center items-center gap-2 active:scale-[0.98] transition-transform shadow-md disabled:opacity-90"
                    onPress={createRoom}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={COLORS.text} />
                    ) : (
                        <>
                            <Feather name="plus" color={COLORS.text} size={18} />
                            <Text style={{ color: COLORS.text }} className="font-bold text-base tracking-wide">
                                Create Room
                            </Text>
                        </>
                    )}
                </Pressable>
            </View>
        </Screen>
    )
}