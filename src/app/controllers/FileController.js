import File from "../models/File";

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    await File.create({
      name,
      path
    });
    return res.json(req.file);
  }
}

export default new FileController();
