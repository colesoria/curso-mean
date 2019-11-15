const mongoosePaginate = require("mongoose-pagination");
const Message = require("./../models/message");

function sendMessage(req, res) {
  if (!req.body.message)
    return res
      .status(500)
      .send({ message: "No hay ningún mensaje que enviar." });
  if (!req.body.receiver)
    return res
      .status(500)
      .send({ message: "No se está enviando el mensaje a ningún usuario." });
  let message = new Message();
  message.message = req.body.message;
  message.receiver = req.body.receiver;
  message.sender = req.user.sub;
  message.save((err, message) => {
    if (err)
      return res
        .status(500)
        .send({ message: "No se ha podido enviar el mensaje." });
    if (!message)
      return res
        .status(404)
        .send({ message: "No se ha podido enviar el mensaje." });
    return res.status(200).send({ message });
  });
}

function readMessages(req, res) {
  Message.find({ receiver: req.user.sub })
    .sort("created_at", "DESC")
    .populate("sender", (err, messages) => {
      if (err)
        return res.status(500).send({
          message: "Ha habido un problema al intentar recuperar los mensajes."
        });
      if (!messages)
        return res.status(404).send({ message: "No hay mensajes recibidos." });
      return res.status(200).send({ messages });
    });
}

function setMessageRead(req, res) {
  const messageId = req.params.id;
  const receiverId = req.user.sub;
  Message.findOneAndUpdate(
    { _id: messageId, receiver: receiverId },
    { read: true },
    { new: true },
    (err, message) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Ha habido un problema al actualizar el mensaje." });
      if (!message)
        return res
          .status(404)
          .send({ message: "Ha habido un problema al actualizar el mensaje." });
      return res.status(200).send({ message });
    }
  );
}
module.exports = {
  sendMessage,
  readMessages,
  setMessageRead
};
