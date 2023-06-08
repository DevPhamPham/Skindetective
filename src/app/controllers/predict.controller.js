const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const Submission = require("../models/Submission");

class PredictController {
  async predict(req, res) {
    performance.mark('start');
    let userId = req.user.id.toString();
    const imagePath = path.resolve(__dirname, `../../../public/images/ImageFromUser/${userId}`);
    let imageFiles;
  
    try {
      imageFiles = await fs.readdir(imagePath);
    } catch (err) {
      console.log(err);
      res.json({ code: 1, message: "Error to read from server!" })
      return;
    }
  
    imageFiles = imageFiles.filter((file) => {
      const extension = path.extname(file);
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension.toLowerCase());
    });
  
    if (imageFiles.length != 1) {
      console.log('No image file found in directory');
      res.status(404).json({ code: 0, message: "File Not Found" });
      return;
    }

    var sourcePath = path.resolve(path.join(imagePath, imageFiles[0]));
    var targetPath = path.resolve(__dirname, '../../../public/images/SaveImageFromUser/', imageFiles[0]);
    const isTarget = path.join(__dirname, '../../../public/images/SaveImageFromUser');
    try {
      await fs.access(isTarget);
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.mkdir(isTarget, { recursive: true });
      } else {
        console.log(err);
      }
    }

    const imageData = await fs.readFile(path.join(imagePath, imageFiles[0]));

    const config = {
      headers: { "Content-Type": "image/jpeg" },
    };
  
    const layersPath = path.resolve(__dirname, '../../../data/db/layers.js');
    let dataLayers = require("fs").readFileSync(layersPath).toString();
    dataLayers = JSON.parse(dataLayers)
    // console.log(JSON.parse(dataLayers));
    
    axios
      .post("http://localhost:5000/predict", imageData, config)
      .then((response) => {
        // try{
        // } catch (e){
        //   console.error(e)
        // }
        // console.log(response.data); // data predict trả về
        const Top5Data = response.data.result[0]
        .map((value, index) => [value, index])
        .sort((a, b) => b[0] - a[0])
        .slice(0, 6);
        const top5Layers = Top5Data.map(data => ({name: dataLayers[data[1]].name, predict: data[0]}))
        console.log(top5Layers);

        fs.rename(sourcePath, targetPath, (err) => {
          if (err) {
            console.log(err);
            res.json({ code: 1, message: "Server Error" })
            return;
          }
          console.log('Đã di chuyển file ảnh');
        });

        const newSubmission = new Submission({
          userId: req.session.passport.user,
          linkImage: targetPath,
          createAt: Date.now(),
          pending: 1,
        });
        newSubmission.save((err) => {
          if (err)
            return res.status(500).send("Error saving user to database");
          
            // Kết thúc đo thời gian
            performance.mark('end');
            // Ghi lại thông tin thời gian xử lý
            performance.measure('duration', 'start', 'end');
            // Lấy thông tin thời gian xử lý
            const measurements = performance.getEntriesByName('duration');
            console.log(`Thời gian xử lý: ${measurements[0].duration}ms`);
            // performance.clearMarks();
            // performance.clearMeasures();

          res.redirect('/');
        });

      })
      .catch((error) => {
        console.error(error);
      });
  }
  
}

module.exports = new PredictController();

// const fs = require("fs").promises;
// const path = require("path");
// const http = require("http");
// const Submission = require("../models/Submission");

// class PredictController {
//   async predict(req, res) {
//     const imagePath = path.resolve(__dirname, '../../../public/images/ImageFromUser/');
//     let imageFiles;
  
//     try {
//       imageFiles = await fs.readdir(imagePath);
//     } catch (err) {
//       console.log(err);
//       res.json({ code: 1, message: "Error to read from server!" })
//       return;
//     }
  
//     imageFiles = imageFiles.filter((file) => {
//       const extension = path.extname(file);
//       return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension.toLowerCase());
//     });
  
//     if (imageFiles.length != 1) {
//       console.log('No image file found in directory');
//       res.status(404).json({ code: 0, message: "File Not Found" });
//       return;
//     }

//     var sourcePath = path.resolve(path.join(imagePath, imageFiles[0]));
//     var targetPath = path.resolve(__dirname, '../../../public/images/SaveImageFromUser/', imageFiles[0]);

//     const imageData = await fs.readFile(path.join(imagePath, imageFiles[0]));

//     const options = {
//       hostname: 'localhost',
//       port: 5000,
//       path: '/predict',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'image/jpeg'
//       }
//     };

//     const layersPath = path.resolve(__dirname, '../../../data/db/layers.js');
//     const dataLayers = require("fs").readFileSync(layersPath).toString();
//     // console.log(JSON.parse(dataLayers));

//     const reqHttp = http.request(options, (resHttp) => {
//       let data = '';
//       resHttp.on('data', (chunk) => {
//         data += chunk;
//       });
//       resHttp.on('end', () => {
//         console.log(data);
//         fs.rename(sourcePath, targetPath, (err) => {
//           if (err) {
//             console.log(err);
//             res.json({ code: 1, message: "Server Error" })
//             return;
//           }
//           console.log('Đã di chuyển file ảnh');
//         });

//         const newSubmission = new Submission({
//           userId: req.session.passport.user,
//           linkImage: targetPath,
//           createAt: Date.now(),
//           pending: 1,
//         });
//         newSubmission.save((err) => {
//           if (err)
//             return res.status(500).send("Error saving user to database");
//           res.redirect('/');
//         });
//       });
//     });

//     reqHttp.on('error', (error) => {
//       console.error(error);
//     });

//     reqHttp.write(imageData);
//     reqHttp.end();
//   }
// }
