import { COLORS } from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import UsernameInput from "../../components/UsernameInput";
import { SOCKET_EVENTS } from "../../constants/events";
import { socket } from "../../services/socket";
import { useSessionStore } from "../../stores/useSessionStore";
import { Feather } from "@expo/vector-icons";

export default function JoinScreen() {
    const params =
        useLocalSearchParams<{
            roomId?: string;
        }>();

    const [username, setUsername] =
        useState("");

    const [roomId, setRoomId] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const {
        setUsername: saveUsername,
        setRoomId: saveRoomId,
    } = useSessionStore();

    const roomIdRef =
        useRef("");

    useEffect(() => {
        if (params.roomId) {
            const id =
                String(
                    params.roomId
                );

            setRoomId(id);

            roomIdRef.current =
                id;
        }
    }, [params.roomId]);

    useEffect(() => {
        roomIdRef.current =
            roomId;
    }, [roomId]);

    useEffect(() => {
        const usernameSuccess =
            () => {
                socket.emit(
                    SOCKET_EVENTS.JOIN_ROOM,

                    String(
                        roomIdRef.current
                    ).trim()
                );
            };

        const roomJoined =
            (
                joinedRoom:
                    string
            ) => {

                setLoading(false);

                saveUsername(
                    username
                );

                saveRoomId(
                    joinedRoom
                );

                router.replace(
                    `/chat/${joinedRoom}`
                );
            };

        const roomError =
            (msg: string) => {

                setLoading(false);

                Alert.alert(
                    msg
                );
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
    }, [username]);

    const joinRoom =
        () => {

            if (
                !username.trim()
            ) {

                Alert.alert(
                    "Enter username"
                );

                return;
            }

            if (
                !roomId.trim()
            ) {

                Alert.alert(
                    "Enter room id"
                );

                return;
            }

            setLoading(
                true
            );

            if (
                !socket.connected
            ) {

                socket.connect();
            }

            socket.emit(
                SOCKET_EVENTS.SET_USERNAME,

                username.trim()
            );
        };

    return (
        <View
            className="flex-1 px-6 justify-center gap-6"
            style={{
                backgroundColor:
                    COLORS.background,
            }}
        >
            <Text className="text-white text-3xl font-bold">
                Join Chat
            </Text>

            <UsernameInput
                value={username}
                onChange={
                    setUsername
                }
            />

            <TextInput
                placeholder="Room ID"
                placeholderTextColor="#666"
                value={roomId}
                onChangeText={
                    setRoomId
                }
                className="bg-zinc-900 text-white rounded-2xl px-5 py-4 border border-zinc-800"
            />

            <Pressable
                disabled={
                    loading
                }
                onPress={
                    joinRoom
                }
                style={{
                    backgroundColor:
                        loading
                            ? `${COLORS.primary}80`
                            : COLORS.primary,
                }}
                className="w-full h-[56px] rounded-2xl flex-row justify-center items-center gap-2"
            >
                {loading ? (
                    <ActivityIndicator
                        color={
                            COLORS.text
                        }
                    />
                ) : (
                    <>
                        <Feather
                            name="log-in"
                            size={18}
                            color={
                                COLORS.text
                            }
                        />

                        <Text
                            style={{
                                color:
                                    COLORS.text,
                            }}
                            className="font-bold"
                        >
                            Join Room
                        </Text>
                    </>
                )}
            </Pressable>
        </View>
    );
}