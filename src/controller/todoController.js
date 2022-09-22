const todoModel = require("../model/todoList");

module.exports.getall = async function (req, res) {
  const resp = await todoModel.find();

  if (resp) {
    res.send({
      success: true,
      data: resp,
    });
  } else {
    res.send({
      success: false,
      data: [],
    });
  }
};

module.exports.get = async function (req, res) {
  const { id } = req.params;

  const resp = await todoModel.findById(id);

  if (resp) {
    res.send({
      success: true,
      data: resp,
    });
  } else {
    res.send({
      success: false,
      data: [],
    });
  }
};

module.exports.create = async function (req, res) {
  const { title, desc } = req.body;

  try {
    const resp = await todoModel.create({
      title,
      desc,
    });

    res.send({
      success: true,
      data: resp,
    });
  } catch (e) {
    console.log("Error ----------- ", e);
    res.send({
      success: false,
      error: e,
    });
  }
};

module.exports.update = async function (req, res) {
  const { id } = req.params;
  const { title, desc } = req.body;

  const resp = await todoModel.findById(id);

  console.log(resp);

  if (resp) {
    resp.title = title;
    resp.desc = desc;

    await resp.save();

    res.send({
      success: true,
      data: resp,
    });
  }
};
module.exports.delete = async function (req, res) {
  const { id: _id } = req.params;

  const resp = await todoModel.deleteOne({ _id });

  res.send({
    success: true,
    data: {
      id: _id,
    },
  });
};
