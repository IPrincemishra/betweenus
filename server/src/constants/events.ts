export const SOCKET_EVENTS = {
    CONNECTION: "connection",
    SET_USERNAME: "set_username",
    USERNAME_SUCCESS: "username_success",
    USERNAME_ERROR: "username_error",
    CREATE_ROOM: "create_room",
    ROOM_CREATED: "room_created",
    JOIN_ROOM: "join_room",
    ROOM_JOINED: "room_joined",
    ROOM_ERROR: "room_error",
    USER_ONLINE: "user_online",
    USER_OFFLINE: "user_offline",
    SEND_MESSAGE: "send_message",
    RECEIVE_MESSAGE: "receive_message",
    MESSAGE_ERROR: "message_error",
    TYPING_START: "typing_start",
    TYPING_STOP: "typing_stop"
} as const;