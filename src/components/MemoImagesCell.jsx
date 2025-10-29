import React, { useState } from "react";
import {
  TableCell,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@mui/icons-material/Close";

function MemoImagesCell({ memo }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0); // track current slide

  const handleOpen = () => {
    setIndex(0); // reset to first image each time
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  console.log("Memo images:", memo.images);

  return (
    <>
      <TableCell>
        {Array.isArray(memo.images) && memo.images.length > 0 ? (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleOpen}
          >
            View
          </Button>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No images
          </Typography>
        )}
      </TableCell>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <SwipeableViews
            index={index}
            onChangeIndex={(i) => setIndex(i)}
            enableMouseEvents
          >
            {memo.images.map((img, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <img
                  src={img.image_url}   // 👈 use the property
                  alt={`Memo Image ${i + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: 500,
                    objectFit: "contain",
                    borderRadius: 8
                  }}
                />
              </div>
            ))}

          </SwipeableViews>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MemoImagesCell;
