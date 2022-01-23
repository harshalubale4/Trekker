const Trek = require('../models/trekker')
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
    const treks = await Trek.find({})
    res.render("treks/index.ejs", { treks })
};

module.exports.renderNewForm = (req, res) => {
    res.render("treks/new.ejs")
};

module.exports.createTrekSpot = async (req, res, next) => {
    const trek = new Trek(req.body.trek);
    trek.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    trek.author = req.user._id;
    await trek.save()
    console.log(trek);
    req.flash('success', 'Successfully made a new Trek Spot');
    res.redirect(`/treks/${trek._id}`)
};

module.exports.showTrekSpot = async (req, res) => {
    const { id } = req.params
    const trek = await Trek.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!trek) {
        req.flash('error', "Oopsies!! the Trek Spot Doesn't Exist")
        res.redirect('/treks');
    }
    res.render("treks/show.ejs", { trek })
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const trek = await Trek.findById(id);
    if (!trek) {
        req.flash('error', "Oopsies!! the Trek Spot Doesn't Exist")
        res.redirect('/treks');
    }
    res.render("treks/edit", { trek })
};

module.exports.updateTrekSpot = async (req, res) => {
    const { id } = req.params;
    const trek = await Trek.findByIdAndUpdate(id, { ...req.body.trek })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    trek.images.push(...images);
    await trek.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await trek.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Updated Trek Spot')
    res.redirect(`/treks/${trek._id}`)
};

module.exports.deleteTrekSpot = async (req, res) => {
    const { id } = req.params;
    const deletedSpot = await Trek.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted a Trek Spot')
    res.redirect("/treks");
};