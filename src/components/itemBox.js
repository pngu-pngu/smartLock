import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

export default function ItemBox({ searchId, searchImage, searchTitle, searchPrice, onAddToCart }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={searchImage}
        alt={searchTitle}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {searchTitle}
        </Typography>
      </CardContent>
      <CardActions>
        <Typography variant="h6">{searchPrice}</Typography>
        <IconButton
          size="small"
          onClick={() => onAddToCart({
            id: searchId, 
            title: searchTitle, 
            price: searchPrice, 
            imageUrl: searchImage
          })}
        >
          <AddShoppingCartIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
