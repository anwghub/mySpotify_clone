import {v2 as cloudinary} from 'cloudinary'
import songModel from '../models/songModel.js';

const addSong = async(req,res) =>{
    try{
        const name = req.body.name;
        const desc = req.body.desc;
        const album= req.body.album;

        if (!name || !desc || !album || !req.files.audio || !req.files.image) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {resource_type:"video"});
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"});
        const duration = `${Math.floor(audioUpload.duration/60)}:${Math.floor(audioUpload.duration%60)}`

        console.log(name, desc, album, audioUpload, imageUpload)

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        }
        const song= songModel(songData);
        await song.save();

        res.json({success:true, message:"Song Added"});

    }catch(error){
        res.status(500).json({success:false, message: 'An error occurred', error: error.message});
    }
}

const listSong = async(req,res) =>{
    try {
        const allSongs = await songModel.find(); // Adjust query as needed
        res.json({ success: true, data: allSongs });
    } catch (error) {
        console.error('Error listing songs:', error);
        res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
}

const removeSong = async(req,res)=>{
    try{
        await songModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Song removed"});

    }catch(error){
        res.json({success: false});
    }
}

export {addSong, listSong, removeSong};