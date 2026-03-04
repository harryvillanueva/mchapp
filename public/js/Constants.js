const Constants = {
      SOCKET_EMIT_TO_SERVER_LOCK: "RequestLock",
      SOCKET_CATCH_MSG_FROM_SERVER: "ResponseSocketBluetooth",
      SOCKET_EMIT_TO_SERVER_ADD: "Log",

      // Acciones LOCK DEVICE
      ACTION_OPENLOCK: "openLock",
      ACTION_NEWCODE: "newCode",
      ACTION_SETCARD: "setCard",
      ACTION_OPENPORTAL: "openPortal",
      ACTION_TOGGLELIGHT: "toggleLight",
      ACTION_SYNCTIME: "syncTime",

      TYPE_CODE_DEVICE: 2, // Web Client Device

      CODE_ALERT_CP: "CP", // Control piso
      CODE_ALERT_CC: "CC", // Cambiar codigo
      CODE_ALERT_LLM: "LLM" // Llave Magnetica
}