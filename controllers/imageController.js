const mongoose = require("mongoose");
const Image = require("../models/Image");

const uploadImage = async (req, res) => {
  const newImage = new Image({
    ...req.body,
  });
  newImage
    .save()
    .then((image) => {
      res.status(200).json({ image });
    })
    .catch((err) => {
      res.status(500).json({ message: "can't upload the image", err });
    });
};

const getImages = async (req, res) => {
  const image = await Image.find()
    .then((image) => {
      res.status(200).json({ image });
    })
    .catch((err) => {
      res.status(500).json({ message: "can't get the images", err });
    });
};
const getImage = async (req, res) => {
  const image = await Image.findOne({_id: req.body})
    .then((image) => {
      res.status(200).json({ image });
    })
    .catch((err) => {
      res.status(500).json({ message: "can't get the image", err });
    });
};

// Update a image
const updateImage = async (req, res) => {
  const { id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
    return res.status(404).json({ error: "image id is wrong!" });
  }
  const image = await Image.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  )
    .then((image) => {
      return res.status(200).json({ message: "image updated!", image });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
  if (!image) {
    return res.status(500).json({ message: "no image found!" });
  }
};

const deleteImage = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: "image id is wrong!" });
    }
    const image = await Image.findByIdAndUpdate(
      { _id: req.body },
      {
        ...req.body,
      },
      { new: true }
    )
      .then((image) => {
        return res.status(200).json({ message: "image updated!", image });
      })
      .catch((err) => {
        res.status(500).json({ err: err });
      });
    if (!image) {
      return res.status(500).json({ message: "no image found!" });
    }
};

module.exports = {
  uploadImage, getImages, getImage, deleteImage, updateImage
}