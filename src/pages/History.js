import React, { useState, useEffect } from "react";
import { Container, Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";

// Place holder for API call that gets camera data
const fetchHistoryData = async () => {
  return [
    {
      id: 1,
      imageUrl: "https://via.placeholder.com/150", // will be relaced with actual image blob URL
      dateTime: "2025-03-01 14:30:00",
      status: "Unlocked",
    },
    {
      id: 2,
      imageUrl: "https://via.placeholder.com/150",
      dateTime: "2025-03-01 15:10:00",
      status: "Denied",
    },
  ];
};

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHistoryData(); //placeholder
      setHistory(data);
    };
    loadData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
        Access History
      </Typography>
      <Grid container spacing={2}>
        {history.map((entry) => (
          <Grid item xs={12} sm={6} md={4} key={entry.id}>
            <Card>
              <CardMedia component="img" height="200" image={entry.imageUrl} alt="Person at the lock" />
              <CardContent>
                <Typography variant="body1"><strong>Date & Time:</strong> {entry.dateTime}</Typography>
                <Typography variant="body1">
                  <strong>Status:</strong>{" "}
                  <span style={{ color: entry.status === "Unlocked" ? "green" : "red" }}>
                    {entry.status}
                  </span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default History;

