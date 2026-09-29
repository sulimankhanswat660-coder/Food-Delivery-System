
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

const RESTAURANT_ID = 1;
const RESTAURANT_NAME = "Foodie Restaurant";

const categories = [
  "Burgers",
  "Pizza",
  "Biryani",
  "Chicken",
  "Sandwiches",
  "Drinks",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
};

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFoods = async () => {
    try {
      setLoading(true);

      const foodsQuery = query(
        collection(db, "foods"),
        where("restaurantId", "==", RESTAURANT_ID)
      );

      const snapshot = await getDocs(foodsQuery);

      const foodsData = snapshot.docs.map((foodDoc) => ({
        id: foodDoc.id,
        ...foodDoc.data(),
      }));

      setFoods(foodsData);
    } catch (error) {
      console.error("Error fetching foods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleOpenAdd = () => {
    setEditingFood(null);
    setFormData(emptyForm);
    setOpenDialog(true);
  };

  const handleOpenEdit = (food) => {
    setEditingFood(food);

    setFormData({
      name: food.name || "",
      description: food.description || "",
      price: food.price ?? "",
      category: food.category || "",
      image: food.image || "",
    });

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setEditingFood(null);
    setFormData(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.category ||
      !formData.image.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const price = Number(formData.price);

    if (Number.isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);

      const foodData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price,
        category: formData.category,
        image: formData.image.trim(),
        restaurantId: RESTAURANT_ID,
        restaurantName: RESTAURANT_NAME,
      };

      if (editingFood) {
        const foodRef = doc(db, "foods", editingFood.id);

        await updateDoc(foodRef, foodData);
      } else {
        await addDoc(collection(db, "foods"), foodData);
      }

      await fetchFoods();

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving food:", error);
      alert("Failed to save food.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (food) => {
    setFoodToDelete(food);
    setDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    if (deleting) return;

    setDeleteDialog(false);
    setFoodToDelete(null);
  };

  const handleDelete = async () => {
    if (!foodToDelete) return;

    try {
      setDeleting(true);

      const foodRef = doc(db, "foods", foodToDelete.id);

      await deleteDoc(foodRef);

      setFoods((currentFoods) =>
        currentFoods.filter(
          (food) => food.id !== foodToDelete.id
        )
      );

      handleCloseDelete();
    } catch (error) {
      console.error("Error deleting food:", error);
      alert("Failed to delete food.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff8f5",
        }}
      >
        <CircularProgress sx={{ color: "#ff5a36" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#fff8f5",
        py: { xs: 5, md: 7 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
            mb: 5,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#ff5a36",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Restaurant Panel
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "2rem",
                  md: "3rem",
                },
              }}
            >
              Manage Foods
            </Typography>

            <Typography
              sx={{
                color: "#777",
                mt: 1,
              }}
            >
              Add, edit, and remove food items from your menu.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              backgroundColor: "#ff5a36",
              borderRadius: 2,
              px: 3,
              py: 1.3,
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "#e94c2b",
              },
            }}
          >
            Add Food
          </Button>
        </Box>

        {/* Food List */}
        {foods.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #eeeeee",
              textAlign: "center",
              p: 5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              No Foods Available
            </Typography>

            <Typography
              sx={{
                color: "#777",
                mb: 3,
              }}
            >
              Add your first food item to the menu.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              sx={{
                backgroundColor: "#ff5a36",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#e94c2b",
                },
              }}
            >
              Add Food
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {foods.map((food) => (
              <Grid
                key={food.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    border: "1px solid #eeeeee",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image */}
                  <Box
                    component="img"
                    src={food.image}
                    alt={food.name}
                    sx={{
                      width: "100%",
                      height: 210,
                      objectFit: "cover",
                    }}
                  />

                  <CardContent
                    sx={{
                      p: 2.5,
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    {/* Category */}
                    <Typography
                      sx={{
                        color: "#ff5a36",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        mb: 0.8,
                      }}
                    >
                      {food.category}
                    </Typography>

                    {/* Name */}
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        mb: 1,
                      }}
                    >
                      {food.name}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 2,
                      }}
                    >
                      {food.description}
                    </Typography>

                    {/* Price */}
                    <Typography
                      sx={{
                        color: "#ff5a36",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        mb: 2,
                      }}
                    >
                      Rs. {Number(food.price).toLocaleString()}
                    </Typography>

                    {/* Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: "auto",
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEdit(food)}
                        sx={{
                          borderColor: "#ff5a36",
                          color: "#ff5a36",
                          borderRadius: 2,
                          "&:hover": {
                            borderColor: "#e94c2b",
                            backgroundColor: "#fff5f1",
                          },
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleOpenDelete(food)}
                        sx={{
                          borderColor: "#d32f2f",
                          color: "#d32f2f",
                          borderRadius: 2,
                          "&:hover": {
                            borderColor: "#b71c1c",
                            backgroundColor: "#fff5f5",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add / Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <DialogTitle
              sx={{
                fontWeight: 800,
                fontSize: "1.4rem",
              }}
            >
              {editingFood ? "Edit Food" : "Add New Food"}
            </DialogTitle>

            <DialogContent>
              <TextField
                fullWidth
                label="Food Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                required
              />

              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                inputProps={{
                  min: 1,
                }}
                required
              />

              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                margin="normal"
                required
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                  >
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                margin="normal"
                placeholder="https://example.com/food.jpg"
                required
              />
            </DialogContent>

            <DialogActions
              sx={{
                px: 3,
                pb: 3,
                gap: 1,
              }}
            >
              <Button
                onClick={handleCloseDialog}
                disabled={saving}
                sx={{
                  color: "#555",
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{
                  backgroundColor: "#ff5a36",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    backgroundColor: "#e94c2b",
                  },
                }}
              >
                {saving
                  ? "Saving..."
                  : editingFood
                  ? "Update Food"
                  : "Add Food"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog
          open={deleteDialog}
          onClose={handleCloseDelete}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
            }}
          >
            Delete Food?
          </DialogTitle>

          <DialogContent>
            <Typography sx={{ color: "#666" }}>
              Are you sure you want to delete{" "}
              <strong>{foodToDelete?.name}</strong>?
              This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              pb: 3,
              gap: 1,
            }}
          >
            <Button
              onClick={handleCloseDelete}
              disabled={deleting}
              sx={{
                color: "#555",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleDelete}
              disabled={deleting}
              sx={{
                backgroundColor: "#d32f2f",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#b71c1c",
                },
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ManageFoods;
