const Trek = require('../models/trekker')

module.exports.index = async (req, res) => {
    const treks = await Trek.find({})
    res.render("treks/index.ejs", { treks })
};

module.exports.renderNewForm = (req, res) => {
    res.render("treks/new.ejs")
};

module.exports.createTrekSpot = async (req, res, next) => {
    const trek = new Trek(req.body.trek);
    trek.author = req.user._id;
    await trek.save()
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
    trek = await Trek.findByIdAndUpdate(id, { ...req.body.trek })
    req.flash('success', 'Successfully Updated Trek Spot')
    res.redirect(`/treks/${trek._id}`)
};

module.exports.deleteTrekSpot = async (req, res) => {
    const { id } = req.params;
    const deletedSpot = await Trek.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted a Trek Spot')
    res.redirect("/treks");
};