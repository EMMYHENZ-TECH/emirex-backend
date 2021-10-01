const Task = require("../models/nip/task");
const Comment = require("../models/nip/comments");
const moment = require("moment");
const Nip = require("../models/nip/nip");

exports.createTask = (req, res) => {
  let { title, author, content } = req.body;

  let newTask = new Task({
    title,
    author,
    content,
    date: moment().format("MMMM Do YYYY, h:mm:ss a"),
    banner: req.file.path,
  });
  newTask
    .save()
    .then(() => {
      return res.status(201).json({
        message: "successfully created",
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "an error occured",
      });
    });
};
exports.getTasks = (req, res) => {
  Task.find({})
    .populate({ path: "comments", model: Comment })
    .then((tasks) => {
      return res.status(200).json({
        tasks,
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "an error occured",
      });
    });
};

exports.singleTask = (req, res) => {
  Task.findOne({ _id: req.params.id })
    .populate({ path: "comments", model: Comment })
    .then((tasks) => {
      return res.status(201).json({
        tasks,
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "an error occured",
      });
    });
};

exports.deleteTask = (req, res) => {
  Task.findOneAndDelete({ _id: req.params.id })
    .then((tasks) => {
      return res.status(200).json({
        message: "successfully deleted",
      });
    })
    .catch(() => {
      return res.status(400).json({
        message: "an error occured",
      });
    });
};

exports.comment = (req, res) => {
  const { content, id } = req.body;
  Task.findOne({ _id: req.params.id }).then((task) => {
    let spammer = task.commenter_id.filter((usr) => {
      return usr == id;
    });
    if (spammer.length == 0) {
      Nip.findOne({ _id: id }, (err, nip) => {
        let comment = new Comment({
          comment: content,
          name: nip.fullname,
        });
        task.commenter_id.push(id)
        task.comments.push(comment);
        nip.earning+=30
        nip.save()
        .then(()=>{
            comment.save((error) => {
              if (error) return res.send(error);
            });
            task.save((error, post) => {
              if (error) return res.send(error);
              res.send(post);
            });
        })
      });
    } else {
      Nip.findOne({ _id: id }, (err, nip) => {
        let comment = new Comment({
          comment: content,
          name: nip.fullname,
        });
        task.comments.push(comment);
        comment.save((error) => {
          if (error) return res.send(error);
        });
        task.save((error, post) => {
          if (error) return res.send(error);
          res.send(post);
        });
      });
    }
  });
};

exports.like = (req, res) => {
  let { like_type, id } = req.body;
  Task.findOne({ _id: req.params.id }).then((post) => {
    let spammer = post.likers_id.filter((usr) => {
      return usr == id;
    });
    if (spammer.length == 0) {
      if (like_type == "increment") {
        post.likes_count += 1;
        Nip.findOne({ _id: id }, (err, nip) => {
          if (err) return res.status(400).json({ message: "an erorr occured" });
          if (nip && nip.nipStatus == true) {
            nip.earning += 20;
            nip.save();
            post.likers_id.push(id);
            post.save((error, post) => {
              if (error) return res.send(error);
              res.send(post);
            });
          } else {
            return res.status(400).json({
              message: "Opps your account has not been activated",
            });
          }
        });
      }
    } else {
      return res.status(400).json({
        message: "you cannot earn twice on this post",
      });
    }
  });
};
exports.share = (req, res) => {
  let { id } = req.body;
  Task.findOne({ _id: req.params.id }).then((post) => {
    let spammer = post.sharer_id.filter((usr) => {
      return usr == id;
    });
    if (spammer.length == 0) {
        post.sharer_count += 1;
        Nip.findOne({ _id: id }, (err, nip) => {
          if (err) return res.status(400).json({ message: "an erorr occured" });
          if (nip && nip.nipStatus == true) {
            nip.earning += 50;
            nip.save();
            post.sharer_id.push(id);
            post.save((error, post) => {
              if (error) return res.send(error);
              res.send(post);
            });
          } else {
            return res.status(400).json({
              message: "Opps your account has not been activated",
            });
          }
        });
      
    } else if(spammer.length > 0) {
      return res.status(400).json({
        message: "you cannot earn twice on this post",
      });
    }
  });
};


