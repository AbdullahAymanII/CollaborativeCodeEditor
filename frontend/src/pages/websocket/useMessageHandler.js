//
//
// export const useMessageHandler = (wsRef, isConnected, liveEditing, currentFile) => {
//     const publishCodeChange = (user, code) => {
//         if (wsRef.current && isConnected && liveEditing) {
//             wsRef.current.publish({
//                 destination: `/app/code/updates`,
//                 body: JSON.stringify({
//                     userId: user.name,
//                     filename: currentFile.filename,
//                     roomId: currentFile.roomId,
//                     projectName: currentFile.projectName,
//                     code,
//                 }),
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//         }
//     };
//
//     const sendChatMessage = (chatMessage) => {
//         if (wsRef.current && isConnected) {
//             wsRef.current.publish({
//                 destination: `/app/chat/${currentFile.roomId}`,
//                 body: JSON.stringify(chatMessage),
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//             });
//         }
//     };
//
//     const sendActionMessage = (user, actionType, currentFile, role) => {
//         if (wsRef.current && isConnected) {
//             const actionMessage = {
//                 content: `${user.name} performed a ${actionType} on ${currentFile.filename}`,
//                 sender: user.name,
//                 roomId: currentFile.roomId,
//                 projectName: currentFile.projectName,
//                 role,
//             };
//             sendChatMessage(actionMessage);
//         }
//     };
//
//     return { publishCodeChange, sendChatMessage, sendActionMessage };
// };
