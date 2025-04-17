import React, { useState, useEffect } from "react";
import { Container, Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";
import * as API from '../api.js';
import axios from 'axios';



const fetchHistoryData = async () => {
  try {
    const imagesResponse = await API.imagesAPI.get(); // Fetch images from the API
    
    console.log("Raw API response:", imagesResponse);

    // Check if the response contains the 'values' property and it's an array
    if (imagesResponse && Array.isArray(imagesResponse.values)) {
      //console.log("Images are in the 'values' array format, proceeding to map.");

      return imagesResponse.values.map((image, index) => {
        //console.log("Image object:", image);

        // Check if image data exists
        if (image.image_image) {

          console.log("Image data ", image.image_image);
          
          let base64Image = "";
          base64Image = `data:image/jpeg;base64,${image.image_image}`; // Ensure the prefix is added here
          console.log("base64", base64Image);
          

          return {
            id: image.image_id,  // Image ID
            imageUrl: base64Image,  // Base64 image URL for rendering
            dateTime: image.image_datetime_captured,  // Captured date and time
            status: image.image_lock_status || 'Unknown',  // Lock status
            trusted: image.image_trusted_id || 'Unknown',  // Trusted status
          };
        } else {
          console.error("Image data is missing or not in expected format");
          return {};  // Return an empty object if image data is invalid
        }
      });
    } else {
      console.log('No images found or invalid response structure');
      return [];  // Return an empty array if imagesResponse.values is not an array
    }
  } catch (error) {
    console.error('Error fetching history data:', error);
    return [];  // Return an empty array on error
  }
};



const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHistoryData(); 
      setHistory(data); // Store fetched data into state
      console.log("data",data);
    };
    loadData();
  }, []);

  return ( 
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
        Access History
      </Typography>
      <Grid container spacing={2}>
        {history
          .slice() // Make a copy to avoid mutating the original array
          .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)) // Sort by dateTime
          .map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry.id}>
              <Card>
                {/* Image displayed as a Base64-encoded string */}
                {console.log(entry.imageUrl)}
                <CardMedia
                  component="img"
                  height="300"
                  image={entry.imageUrl} // Base64 image will be here
                  alt={entry.trusted === "Unknown" ? "Unknown" : "Trusted"}
                />
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

