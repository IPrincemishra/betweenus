import Screen from "@/components/ui/Screen";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import UsernameInput from "../../components/UsernameInput";
import { SOCKET_EVENTS } from "../../constants/events";
import { socket } from "../../services/socket";
import { useSessionStore } from "../../stores/useSessionStore";
export default function CreateScreen() {

    const [username, setUsername] = useState("");

    const {
        setUsername: saveUsername,
        setRoomId
    } = useSessionStore();

    useEffect(() => {
        const onSuccess = () => {
            socket.emit(
                SOCKET_EVENTS.CREATE_ROOM
            )
        };
        const onError = (msg: string) => {
            Alert.alert(msg)
        };
        const onRoomCreated = (data: any) => {
            saveUsername(username);
            setRoomId(data.roomId);
            router.replace(`/chat/${data.roomId}`);
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

    }, [
        username
    ]);

    const createRoom = () => {

        if (!username.trim()) {
            Alert.alert("Enter username");
            return;
        }
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
                    className="bg-white rounded-2xl p-5"
                    onPress={createRoom}
                >
                    <Text className="text-center font-semibold">
                        Create Room
                    </Text>
                </Pressable>
            </View>
        </Screen>
    )
}