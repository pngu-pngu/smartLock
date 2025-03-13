import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import * as API from "../api.js";
import { v4 as uuidv4 } from "uuid";

const userId = "000000001";

const fetchTrustedData = async () => {
    try {
      const response = await API.trustedAPI.get({ trusted_user_id: userId });
  
      if (response && Array.isArray(response.values)) {
        return response.values.map(person => {
          let base64Image = "";
  
          if (person.trusted_profilepic && person.trusted_profilepic.data) {
            // Convert Buffer data to Base64 safely
            const uint8Array = new Uint8Array(person.trusted_profilepic.data);
            const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
            base64Image = `data:image/jpeg;base64,${btoa(binaryString)}`;
          }
  
          return {
            trusted_id: person.trusted_id,
            trusted_name: person.trusted_name,
            trusted_profilepic: base64Image
          };
        });
      }
      return [];
    } catch (error) {
      console.error("Error fetching trusted data:", error);
      return [];
    }
  };
  

const Trusted = () => {
  const [trustedList, setTrustedList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editPerson, setEditPerson] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", profilePic: "" });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTrustedData();
      console.log("Fetched Data:", data); // Debugging step
      setTrustedList(data);
    };
    loadData();
  }, []);

  const handleEditChange = (e) => {
    setEditPerson({ ...editPerson, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await API.trustedAPI.patchById(editPerson.trusted_id, {
        trusted_name: editPerson.trusted_name,
      });
      setTrustedList(
        trustedList.map((person) =>
          person.trusted_id === editPerson.trusted_id ? editPerson : person
        )
      );
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error updating trusted person:", error);
    }
  };

  const handleAddUser = async () => {
    try {
      const newUser = {
        trusted_name: newPerson.name,
        trusted_profilepic: newPerson.profilePic, // Already Base64-encoded
        trusted_user_id: userId,
        trusted_id: uuidv4(),
      };

      const response = await API.trustedAPI.post(newUser);
      setTrustedList([...trustedList, response]); // Assuming API returns the created object
      setIsAddDialogOpen(false);
      setNewPerson({ name: "", profilePic: "" });
    } catch (error) {
      console.error("Error adding trusted person:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPerson({ ...newPerson, profilePic: reader.result.split(",")[1] }); // Extract Base64 content
    };
    reader.readAsDataURL(file);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
        Trusted Individuals
      </Typography>

      {/* Add Trusted User Button - Positioned Below Title */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Trusted User
        </Button>
      </Box>

      <Grid container spacing={2}>
        {trustedList.map((person) => (
          <Grid item xs={12} sm={6} md={4} key={person.trusted_id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={person.trusted_profilepic}
                alt={person.trusted_name}
              />
              <CardContent>
                <Typography variant="h6">{person.trusted_name}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedPerson(person);
                    setEditPerson(person);
                  }}
                >
                  View/Edit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      {selectedPerson && (
        <Dialog open={Boolean(selectedPerson)} onClose={() => setSelectedPerson(null)}>
          <DialogTitle>Edit {selectedPerson.trusted_name}</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="trusted_name"
              value={editPerson.trusted_name}
              onChange={handleEditChange}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedPerson(null)}>Cancel</Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add Trusted User Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add Trusted User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newPerson.name}
            onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
            fullWidth
            margin="dense"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Trusted;
