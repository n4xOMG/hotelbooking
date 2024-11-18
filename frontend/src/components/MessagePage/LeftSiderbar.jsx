import React, { useEffect } from "react";
import { Avatar, Box, IconButton, Typography, Tabs, Tab } from "@mui/material";
import { Search, PushPin } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserChats } from "../../redux/chat/chat.action";

const LeftSidebar = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(fetchUserChats());
  }, [dispatch]);

  const handleChatClick = (chatId, user2Id) => {
    navigate(`/messages/${chatId}/${user2Id}`);
  };

  return (
    <Box sx={{ width: 280, border: 1, borderColor: "divider", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: 22 }}>Messages</Typography>
        </Box>
        <IconButton>
          <Search />
        </IconButton>
      </Box>
      <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} variant="fullWidth" sx={{ px: 2 }}>
        <Tab label="All" value="all" />
      </Tabs>
      <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Pinned Message
        </Typography>
        <PushPin fontSize="small" />
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {chats.map((chat) => {
          const otherParticipant = chat.participants.find((p) => p._id !== user._id);
          if (!otherParticipant) return null;

          return (
            <Box
              key={chat._id}
              sx={{ display: "flex", gap: 2, p: 1, borderRadius: 1, "&:hover": { bgcolor: "action.hover" } }}
              onClick={() => handleChatClick(chat._id, otherParticipant._id)}
            >
              <Avatar alt={otherParticipant.username} src={otherParticipant.avatarUrl || "/placeholder.svg"} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography fontWeight="medium">{otherParticipant.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {chat.lastMessageTime}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {chat.lastMessage}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default LeftSidebar;
