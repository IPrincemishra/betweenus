import { View, Text, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import UsernameInput from "../../components/UsernameInput";
import { socket } from "../../services/socket";
import { SOCKET_EVENTS } from "../../constants/events";
import { useSessionStore } from "../../stores/useSessionStore";
import Screen from "@/components/ui/Screen";
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
            <View className="flex-1  px-6 justify-center gap-6">
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