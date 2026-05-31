import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import UsernameInput from "../../components/UsernameInput";
import { socket } from "../../services/socket";
import { SOCKET_EVENTS } from "../../constants/events";
import { useSessionStore } from "../../stores/useSessionStore";


export default function JoinScreen() {

    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");

    const {
        setUsername: saveUsername,
        setRoomId: saveRoomId
    } = useSessionStore();

    useEffect(() => {
        const usernameSuccess = () => {
            socket.emit(
                SOCKET_EVENTS.JOIN_ROOM,
                roomId.trim()
            )
        };

        const roomJoined = (joinedRoom: string) => {
            saveUsername(
                username
            );
            saveRoomId(
                joinedRoom
            );
            router.replace(`/chat/${joinedRoom}`)
        };

        const roomError = (msg: string) => {
            Alert.alert(msg)
        };

        socket.on(
            SOCKET_EVENTS.USERNAME_SUCCESS,
            usernameSuccess
        );

        socket.on(
            SOCKET_EVENTS.ROOM_JOINED,
            roomJoined
        );

        socket.on(
            SOCKET_EVENTS.ROOM_ERROR,
            roomError
        );
        socket.on(
            SOCKET_EVENTS.USERNAME_ERROR,
            roomError
        );

        return () => {
            socket.off(
                SOCKET_EVENTS.USERNAME_SUCCESS,
                usernameSuccess
            );

            socket.off(
                SOCKET_EVENTS.ROOM_JOINED,
                roomJoined
            );

            socket.off(
                SOCKET_EVENTS.ROOM_ERROR,
                roomError
            );

            socket.off(
                SOCKET_EVENTS.USERNAME_ERROR,
                roomError
            );

        };

    }, [username, roomId]);

    const joinRoom = () => {

        if (!username.trim()) {
            Alert.alert("Enter username");
            return;
        }
        if (!roomId.trim()) {
            Alert.alert("Enter room id");
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
        <View className="flex-1 bg-zinc-950 px-6 justify-center gap-6">
            <Text className="text-white text-3xl font-bold">
                Join Chat
            </Text>
            <UsernameInput
                value={username}
                onChange={setUsername}
            />
            <TextInput
                placeholder="Room ID"
                placeholderTextColor="#666"
                value={roomId}
                onChangeText={setRoomId}
                className="bg-zinc-900 text-white rounded-2xl px-5 py-4 border border-zinc-800"
            />
            <Pressable
                className="bg-white rounded-2xl p-5"
                onPress={joinRoom}
            >
                <Text className="text-center font-semibold">
                    Join Room
                </Text>
            </Pressable>
        </View>
    )
}