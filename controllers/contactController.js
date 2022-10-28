const mongoose = require("mongoose");
const Contact = require("../models/Contact");

// get all contact
const getContacts = async (req, res) => {
  try {
    const contact = await Contact.find({}).sort({ createdAt: -1 });
    res.status(200).json({ contact });
  } catch (error) {
    res.status(500).json(error);
  }
};

//get one contact
const getContact = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.find({_id: id});
    res.status(200).json( contact );
  } catch (error) {
    res.status(500).json(error);
  }
};

// create a contact
const postContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(200).json({ contact });
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete one contact
const deleteContact = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "contact id is wrong!" });
  }
  const contact = await Contact.findByIdAndDelete({ _id: id })
    .then((contact) => {
      return res.status(200).json({ message: "contact deleted!", contact });
    })
    .catch((err) => {
      return res.status(500).json({ message: "no contact found!", err: err });
    });
};

// delete all contact
const deleteContacts = async (req, res) => {
  const contact = await Contact.deleteMany({})
    .then((contact) => {
      return res.status(200).json({ message: "contacts deleted!", contact });
    })
    .catch((err) => {
      return res.status(500).json({ message: "no contacts found!", err: err });
    });
};

module.exports = { getContacts, getContact, postContact, deleteContact, deleteContacts };
