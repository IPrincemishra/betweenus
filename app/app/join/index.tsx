import { COLORS } from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import UsernameInput from "../../components/UsernameInput";
import { SOCKET_EVENTS } from "../../constants/events";
import { socket } from "../../services/socket";
import { useSessionStore } from "../../stores/useSessionStore";
import { Feather } from "@expo/vector-icons";


export default function JoinScreen() {

    const params = useLocalSearchParams<{ roomId?: string }>()

    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState(params.roomId ?? "");
    const [loading, setLoading] = useState(false);

    const {
        setUsername: saveUsername,
        setRoomId: saveRoomId
    } = useSessionStore();

    const usernameRef = useRef(username)
    const roomIdRef = useRef(roomId)

    useEffect(() => {
        const usernameSuccess = () => {
            socket.emit(
                SOCKET_EVENTS.JOIN_ROOM,
                roomId.trim()
            )
        };

        const roomJoined = (joinedRoom: string) => {
            setLoading(false)
            saveUsername(username);
            saveRoomId(joinedRoom);
            router.replace(`/chat/${joinedRoom}`)
        };

        const roomError = (msg: string) => {
            setLoading(false)
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

    }, []);

    const joinRoom = () => {

        if (!username.trim()) {
            Alert.alert("Enter username");
            return;
        }
        if (!roomId.trim()) {
            Alert.alert("Enter room id");
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
        <View className="flex-1 px-6 justify-center gap-6" style={{ backgroundColor: COLORS.background }}>
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
                style={{
                    backgroundColor: loading ? `${COLORS.primary}80` : COLORS.primary,
                }}
                disabled={loading}
                className="w-full h-[56px] rounded-2xl flex-row justify-center items-center gap-2 active:scale-[0.98] transition-transform shadow-md"
                onPress={joinRoom}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={COLORS.text} />
                ) : (
                    <>
                        <Feather name="log-in" color={COLORS.text} size={18} />
                        <Text style={{ color: COLORS.text }} className="font-bold text-base tracking-wide">
                            Join Room
                        </Text>
                    </>
                )}
            </Pressable>
        </View>
    )
}