import React from "react";
import { Avatar, Box, IconButton, Typography, Tabs, Tab } from "@mui/material";
import { Search, PushPin } from "@mui/icons-material";
const LeftSidebar = ({ activeTab, setActiveTab }) => (
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
      <Tab label="Personal" value="personal" />
      <Tab label="Groups" value="groups" />
    </Tabs>
    <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="body2" color="text.secondary">
        Pinned Message
      </Typography>
      <PushPin fontSize="small" />
    </Box>
    <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
      {[
        /* Replace this array with dynamic chat list data */
        { name: "Harry Maguire", message: "You need to improve now", time: "09:12 AM", unread: true },
        { name: "United Family", message: "Rashford is typing...", time: "06:25 AM", unread: false },
      ].map((chat, i) => (
        <Box key={i} sx={{ display: "flex", gap: 2, p: 1, borderRadius: 1, "&:hover": { bgcolor: "action.hover" } }}>
          <Avatar alt={chat.name} src="/placeholder.svg" />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography fontWeight="medium">{chat.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {chat.time}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" noWrap>
              {chat.message}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export default LeftSidebar;
