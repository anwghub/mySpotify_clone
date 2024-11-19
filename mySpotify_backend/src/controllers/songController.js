import {v2 as cloudinary} from 'cloudinary'
import songModel from '../models/songModel.js';

const addSong = async(req,res) =>{
    try{
        const name = req.body.name;
        const desc = req.body.desc;
        const album= req.body.album;
        const audioFile = req.files.audio[0]; 
        const imageFile = req.files.image[0];  
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {resource_type:"video"});
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"});
        const duration = `${Math.floor(audioUpload.duration/60)}:${Math.floor(audioUpload.duration%60)}`

        if (!name || !desc || !album || !req.files.audio || !req.files.image) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        console.log(name, desc, album, audioUpload, imageUpload);

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            audio: audioUpload.secure_url,
            duration
        }
        const song = songModel(songData);
        await song.save();

        res.json({success:true, message:"Song Added Successfuly"});

    }catch(error){
        res.status(500).json({success:false, message: 'An error occurred', error: error.message});
    }
}

const listSong = async(req,res) =>{
    try {
        const allSongs = await songModel.find(); 
        if (!allSongs || allSongs.length === 0) {
            return res.status(404).json({ success: false, message: 'No songs found.' });
        }
        res.json({ success: true, songs: allSongs });
    } catch (error) {
        console.error('Error listing songs:', error);
        res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
}

const removeSong = async(req,res)=>{
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "Song ID is required" });
        }

        const deletedSong = await songModel.findByIdAndDelete(id);

        if (!deletedSong) {
            return res.status(404).json({ success: false, message: "Song not found" });
        }

        res.status(200).json({ success: true, message: "Song removed" });
        
    } catch (error) {
        console.error("Error removing song:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export {addSong, listSong, removeSong};