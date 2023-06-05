const multiparty = require("multiparty");
const path = require("path");
const mv = require("mv");
const fs = require("fs").promises;

class UploadController {
  async uploadImage(req, res) {
    if(!req.session.passport.user){
      res.redirect("/");
    }
    const imageDir = path.join(__dirname, '../../../public/images/ImageFromUser');
    try {
      await fs.access(imageDir);
      const files = await fs.readdir(imageDir);
      for (const file of files) {
        await fs.unlink(path.join(imageDir, file));
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(imageDir, { recursive: true });
      } else {
        console.log(err);
      }
    }
    
    const form = new multiparty.Form();
    let oldPath, newPath;
    form.parse(req, (err, fields, files) => {
      if (err) return res.status(500).send(err.message);
      oldPath = files.myImage[0].path;
      newPath = path.join(
        __dirname,
        "../../../public/images",
        "ImageFromUser",
        Date.now() + "_" + files.myImage[0].originalFilename
      );

      mv(oldPath, newPath, (err) => {
        if (err) {
          console.log(err);
          res.json({ success: false, msg: "Gửi ảnh không thành công." });
        } else {
            res.redirect("/predict");
        }
      });
    });
  }
}

module.exports = new UploadController();
