export const SOCKET_EVENTS = {
    SET_USERNAME: "set_username",
    USERNAME_SUCCESS: "username_success",
    USERNAME_ERROR: "username_error",
    CREATE_ROOM: "create_room",
    ROOM_CREATED: "room_created",
    JOIN_ROOM: "join_room",
    ROOM_JOINED: "room_joined",
    ROOM_ERROR: "room_error",
    SEND_MESSAGE: "send_message",
    RECEIVE_MESSAGE: "receive_message",
} as const;