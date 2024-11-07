import React from "react";
import { Card, CardHeader, CardContent, List, ListItem, Typography, Box } from "@mui/material";

const payments = [
  { id: 1, date: "2023-05-15", amount: "$250.00", hotel: "Sunset Resort" },
  { id: 2, date: "2023-04-22", amount: "$180.00", hotel: "City Center Hotel" },
  { id: 3, date: "2023-03-10", amount: "$320.00", hotel: "Mountain View Lodge" },
];

export default function PaymentHistory() {
  return (
    <Card>
      <CardHeader title="Payment History" subheader="View your recent payments" />
      <CardContent>
        <List>
          {payments.map((payment) => (
            <ListItem
              key={payment.id}
              sx={{ display: "flex", justifyContent: "space-between", borderBottom: 1, borderColor: "divider", pb: 1 }}
            >
              <Box>
                <Typography fontWeight="medium">{payment.hotel}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {payment.date}
                </Typography>
              </Box>
              <Typography fontWeight="medium">{payment.amount}</Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
