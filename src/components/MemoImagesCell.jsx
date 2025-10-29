import React, { useState } from "react";
import {
  TableCell,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function MemoImagesCell({ memo }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            style={{ width: "100%", height: "100%" }}
          >
            {memo.images.map((img, i) => (
              <SwiperSlide key={i}>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={img.image_url}
                    alt={`Memo Image ${i + 1}`}
                    style={{
                      width: "100%",
                      maxHeight: 500,
                      objectFit: "contain",
                      borderRadius: 8
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MemoImagesCell;s
