import {v2 as cloudinary} from 'cloudinary';
import albumModel from '../models/albumModel.js';

const addAlbum = async(req,res) =>{
    try{
        const name= req.body.name;
        const desc = req.body.desc;
        const bgColour= req.body.bgColour;
        const imageFile = req.file;
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"});

        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url
        }

        const album = albumModel(albumData);
        await album.save();

        res.json({success: true, message:"Album Added successfully"});

    }catch(error){
        res.json({success: false});
    }
}

const listAlbum = async(req,res) =>{
    
    try {
        const allAlbums = await albumModel.find(); // Adjust query as needed
        res.json({ success: true, albums:allAlbums });
    } catch (error) {
        console.error('Error listing album:', error);
        res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
}

const removeAlbum = async(req,res) =>{
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "Album ID is required" });
        }

        const deletedAlbum = await albumModel.findByIdAndDelete(id);

        if (!albumSong) {
            return res.status(404).json({ success: false, message: "Album not found" });
        }

        res.status(200).json({ success: true, message: "Album removed" });
        
    } catch (error) {
        console.error("Error removing album:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export {addAlbum,listAlbum,removeAlbum};